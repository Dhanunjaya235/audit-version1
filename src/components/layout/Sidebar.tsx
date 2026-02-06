import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    ListTodo,
    CheckSquare,
    FolderKanban,
    LayoutTemplate
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const [isHovered, setIsHovered] = React.useState(false);
    const menuItems = [
        {
            name: 'Projects',
            path: '/projects',
            icon: FolderKanban,
            display: true
        },
        {
            name: 'Audits',
            path: '/audits',
            icon: ListTodo,
            display: true
        },
        {
            name: 'Templates',
            path: '/templates',
            icon: LayoutTemplate,
            display: true

        },
        {
            name: 'My Actions',
            path: '/my-actions',
            icon: CheckSquare,
            display: true
        }
    ];


    return (
        <div
            className={`bg-[#245269] text-white min-h-screen flex flex-col transition-[width] duration-300 ease-in-out will-change-[width] ${isHovered ? 'w-64' : 'w-16'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <nav className="flex-1 px-2 py-8">
                <ul className="space-y-2">
                    {menuItems.filter((item) => item.display).map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-white text-[#245269]'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                    title={!isHovered ? item.name : ''}
                                >
                                    <div className="w-6 flex justify-center">
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                    </div>
                                    <span
                                        className={`ml-3 whitespace-nowrap transition-all duration-200 ${isHovered
                                            ? 'opacity-100 translate-x-0'
                                            : 'opacity-0 -translate-x-2 pointer-events-none'
                                            }`}
                                    >
                                        {item.name}
                                    </span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
