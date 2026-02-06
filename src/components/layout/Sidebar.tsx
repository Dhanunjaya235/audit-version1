import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    UserCheck,
    Handshake,
    ListTodo,
    CheckSquare
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const [isHovered, setIsHovered] = React.useState(false);
    const menuItems = [
        {
            name: 'Templates',
            path: '/templates',
            icon: UserCheck,
            display: true

        },
        {
            name: 'Projects',
            path: '/projects',
            icon: Handshake,
            display: true
        },
        {
            name: 'Audits',
            path: '/audits',
            icon: ListTodo,
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
            className={`bg-[#394253] text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isHovered ? 'w-64' : 'w-16'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Navigation */}
            <nav className="flex-1 px-2 py-8">
                <ul className="space-y-2">
                    {menuItems.filter((item) => item.display).map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-white text-[#394253]'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                    title={!isHovered ? item.name : ''}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {isHovered && (
                                        <span className="ml-3">{item.name}</span>
                                    )}
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
