import type { BannerProps } from "../types/General";

const Banner = ({ title, subtitle, size = "large" }: BannerProps) => {
    const isLarge = size === "large";

    return (
        <section className={`banner ${isLarge ? "" : "banner-sm"} bg-secondary text-white mb-4 ${isLarge ? "py-5 text-center" : "py-4"}`}>
            <div className={`container ${isLarge ? "text-center py-5" : ""}`}>
                <h1 className={`${isLarge ? "display-4" : "display-6 h3"} mb-0`}>{title}</h1>
                {subtitle && <p className="lead mb-0">{subtitle}</p>}
            </div>
        </section>
    );
};

export default Banner;