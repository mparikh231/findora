import { useState } from 'react';
import { Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import NavigationMenuManager from '../../components/Settings/NavigationMenuManager';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('navigation');
    
    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="mb-0">Settings</h3>
            </div>
            
            <Nav tabs>
                <NavItem>
                    <NavLink 
                        className={activeTab === 'navigation' ? 'active' : ''}
                        onClick={() => setActiveTab('navigation')}
                        style={{ cursor: 'pointer' }}
                    >
                        Navigation Menu
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink 
                        className={activeTab === 'general' ? 'active' : ''}
                        onClick={() => setActiveTab('general')}
                        style={{ cursor: 'pointer' }}
                    >
                        General Settings
                    </NavLink>
                </NavItem>
            </Nav>
            
            <TabContent activeTab={activeTab} className="mt-3">
                <TabPane tabId="navigation">
                    <NavigationMenuManager />
                </TabPane>
                <TabPane tabId="general">
                    <Card>
                        <CardBody>
                            <p className="text-muted mb-0">General settings coming soon...</p>
                        </CardBody>
                    </Card>
                </TabPane>
            </TabContent>
        </div>
    );
};

export default SettingsPage;