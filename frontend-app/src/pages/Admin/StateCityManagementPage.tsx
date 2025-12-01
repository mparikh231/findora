import { Edit, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader, Offcanvas } from "reactstrap";
import { formatDate } from "../../utils/helpers";
import { toast } from "react-toastify";
import apiCall from "../../utils/axios";
import type { StateData, StateFormData } from "../../types/States";
import ConfirmModal from "../../components/ConfirmModal";
import Cities from "../../components/Cities/Cities";

const StateCityManagementPage = () => {

    const defaultStateFormData: StateFormData = {
        name: '',
        id: undefined
    };
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCitiesLayoutOpen, setIsCitiesLayoutOpen] = useState<boolean>(false);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    const [statesData, setStatesData] = useState<StateData[]>([]);
    const [stateFormData, setStateFormData] = useState<StateFormData>(defaultStateFormData);
    const [deleteStateId, setDeleteStateId] = useState<number | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [action, setAction] = useState<'add' | 'edit'>('add');
    const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

    const fetchStates = async () => {
        try {
            setIsLoading(true);
            const response = await apiCall.get('/states');
            const { status, data } = response.data;
            if (!status) {
                setStatesData([]);
                return;
            }
            setStatesData(data as StateData[]);
        } catch (error) {
            console.error("Error fetching states:", error);
            toast.error("Failed to fetch states.");
            setStatesData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStateFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: StateFormData = {
                name: stateFormData.name
            };

            setIsFormLoading(true);
            let response;
            if (action === 'edit' && stateFormData.id) {
                response = await apiCall.put(`/states/${stateFormData.id}`, payload);
            } else {
                response = await apiCall.post('/states', payload);
            }

            const { status } = response!.data;

            if (!status) {
                toast.error(`Failed to ${action === 'add' ? 'add' : 'update'} state.`);
                return;
            }

            toast.success(`State ${action === 'add' ? 'added' : 'updated'} successfully.`);
            setStateFormData(defaultStateFormData);
            setAction('add');
            fetchStates();
        } catch (error) {
            console.error(`Error during state ${action === 'add' ? 'addition' : 'update'}:`, error);
            toast.error(`Failed to ${action === 'add' ? 'add' : 'update'} state.`);
        } finally {
            setIsFormLoading(false);
        }
    }

    const editStateAction = (state: StateData) => {
        setAction('edit');
        setStateFormData({
            name: state.name,
            id: state.id
        });
    };

    const deleteState = async (stateId: number) => {
        try {
            setIsLoading(true);
            const response = await apiCall.delete(`/states/${stateId}`);
            const { status } = response.data;
            if (!status) {
                toast.error("Failed to delete state.");
                return;
            }
            fetchStates();
            toast.success("State deleted successfully.");
        } catch (error) {
            console.error("Error deleting state:", error);
            toast.error("Failed to delete state.");
        } finally {
            setIsConfirmModalOpen(false);
            setDeleteStateId(null);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchStates();
    }, []);

    return <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0">States</h3>
        </div>

        <div className="row">
            <form onSubmit={handleStateFormSubmit} className="col-md-4 col-lg-3">
                <Card>
                    <CardHeader>{action === 'add' ? 'Add New State' : 'Edit State'}</CardHeader>
                    <CardBody>
                        <label htmlFor="stateName" className="form-label">State Name:</label>
                        <input type="text" id="stateName" className="form-control" value={stateFormData.name} onChange={(e) => setStateFormData({ ...stateFormData, name: e.target.value })} disabled={isFormLoading} required />
                    </CardBody>
                    <CardFooter className="d-flex align-items-center gap-1">
                        <button className="btn btn-dark d-flex align-items-center gap-1" disabled={isFormLoading} type="submit">
                            <Save size={18} /> {isFormLoading ? 'Saving...' : 'Save'}
                        </button>
                        {action === 'edit' && (
                            <button className="btn btn-secondary d-flex align-items-center gap-1 ms-2" disabled={isFormLoading} type="button" onClick={() => {
                                setAction('add');
                                setStateFormData(defaultStateFormData);
                            }}>
                                <X size={18} /> Cancel
                            </button>
                        )}
                    </CardFooter>
                </Card>
            </form>

            <div className="col-md-8 col-lg-9">
                <div className="card overflow-hidden">
                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: '50px' }}>#</th>
                                    <th>Name</th>
                                    <th style={{ width: '120px' }}>Create Date</th>
                                    <th style={{ width: '120px' }}>Cities</th>
                                    <th style={{ width: '120px' }} className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!isLoading && statesData.length > 0 && statesData.map((state, index) => (
                                    <tr key={`state-row-${state.id}-${index}`}>
                                        <td className="text-center">{state.id}</td>
                                        <td>{state.name}</td>
                                        <td>{formatDate(state.createdAt)}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => {
                                                    setIsCitiesLayoutOpen(true);
                                                    setSelectedStateId(state.id);
                                                }}
                                            >View Cities</button>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-link text-dark" onClick={() => editStateAction(state)}>
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                className="btn btn-sm btn-link text-danger"
                                                onClick={() => {
                                                    setDeleteStateId(state.id);
                                                    setIsConfirmModalOpen(true);
                                                }}
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && statesData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center">No states found.</td>
                                    </tr>
                                )}
                                {isLoading && (
                                    <tr>
                                        <td colSpan={5} className="text-center">Loading states...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <Offcanvas
            isOpen={isCitiesLayoutOpen}
            toggle={() => {
                if (isCitiesLayoutOpen) {
                    setSelectedStateId(null);
                }
                setIsCitiesLayoutOpen(!isCitiesLayoutOpen);
            }}
            direction="end"
            fade={false}
        >
            {selectedStateId && <Cities stateId={selectedStateId} />}
        </Offcanvas>

        <ConfirmModal
            isOpen={isConfirmModalOpen}
            onConfirm={() => {
                deleteState(deleteStateId as number);
            }}
            onCancel={() => {
                setIsConfirmModalOpen(false);
                setDeleteStateId(null);
            }}
        />

    </>;
}

export default StateCityManagementPage;