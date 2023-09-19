import { useEffect, useState } from "react";
import { Link } from "../lib/Router";
import "../scss/intern.scss";
import { IconBox, IconFolder, IconHome, IconSettings } from "@tabler/icons-react";

function MenuManager({ items=[] }){
    let res = [];
    for(const item of items){
        res.push(<MenuItem {...item} key={`to:${item.to}`}></MenuItem>)
    }

    return res;
}

function MenuItem({ name, to, icon }){
    return <li className="nav-item">
            <Link className="nav-link" href={to} >
            <span className="nav-link-icon d-md-none d-lg-inline-block">
                {icon}
            </span>
            <span className="nav-link-title">
                {name}
            </span>
        </Link>
    </li>
}

export function InternPage({ children, user, menuItems=[] }) {
    const [isMenuOpened, setMenuOpened] = useState(false);
    const [isOpenUserDropdown, setOpenUserDropdown] = useState(false);

    useEffect(() => {

        const listener = function(e){
            if(!e.target.closest(".dropdown-menu") && !e.target.closest('[data-bs-toggle="dropdown"]')){
                setOpenUserDropdown(false);
            }
        };
        document.body.addEventListener("click", listener);

        return () => {
            document.body.removeEventListener("click", listener)
        }

    })

    function DropLink(props){
        return <Link onClick={() => setOpenUserDropdown(false)} {...props}>
            {props.children}
        </Link>
    }

    const NavItem = ({ icon, name, to, is_admin=false }) => {
        if(is_admin && !user.is_admin) return null;
        return <MenuItem icon={icon} name={name} to={to} />
    }

    const toggleTheme = (e) => {
        if(e && e.preventDefault) e.preventDefault();
        localStorage.setItem("dh_theme", localStorage.getItem("dh_theme") === "dark" ? "light" : "dark");
        document.body.setAttribute("data-bs-theme", localStorage.getItem("dh_theme"))
    }

    return <>
        <header className="navbar navbar-expand-md d-print-none" data-bs-theme="dark">
            <div className="container-xl">
                <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={() => setMenuOpened(!isMenuOpened)}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                    <Link href="/">
                        DHPanel
                    </Link>
                </h1>
                <div className="navbar-nav flex-row order-md-last">
                    <div className="nav-item d-none d-md-flex me-3">
                        <div className="btn-list">
                        <a href="https://github.com/RyanPhpJs/dhpanel" className="btn" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-pink" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                            </svg>
                            Sponsor
                            </a>
                        </div>
                    </div>
                    <div className="d-none d-md-flex">
                        <a onClick={toggleTheme} className="nav-link px-0 hide-theme-dark me-3 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></svg>
                        </a>
                        <a onClick={toggleTheme} className="nav-link px-0 hide-theme-light me-3 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></svg>
                        </a>
                    </div>
                    <div className="nav-item dropdown">
                        <a onClick={() => setOpenUserDropdown(!isOpenUserDropdown)} className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
                            <span className="avatar avatar-sm" style={{ backgroundImage: `url(${JSON.stringify(user.avatar)})`}}></span>
                            <div className="d-none d-xl-block ps-2">
                                <div>{user.name}</div>
                                <div className="mt-1 small text-secondary">{user.is_admin ? "ADMIN" : "USER"}</div>
                            </div>
                        </a>
                        <div className={"dropdown-menu dropdown-menu-end dropdown-menu-arrow " + (isOpenUserDropdown ? " show" : "") } style={{ top: "55px", right: "10px" }}>
                            <DropLink href="/profile" className="dropdown-item">Profile</DropLink>
                            <DropLink href="/settings" className="dropdown-item">Settings</DropLink>
                            <DropLink href="/logout" className="dropdown-item">Logout</DropLink>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <header className="navbar-expand-md">
            <div className={"collapse navbar-collapse" + (isMenuOpened ? " show" : "")} id="navbar-menu">
                <div className="navbar">
                    <div className="container-xl">
                        <ul className="navbar-nav">
                            <NavItem icon={<IconHome />} to="/" name="Home"/>
                            <NavItem is_admin={true} icon={<IconBox />} to="/packages" name="Pacotes"/>
                            <NavItem is_admin={true} icon={<IconFolder />} to="/files" name="Arquivos" />
                            <NavItem icon={<IconSettings />} to="/settings" name="Configurações" />
                            <MenuManager items={menuItems} />
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        <div className="page-wrapper">
            {children}
        </div>
    </>

}