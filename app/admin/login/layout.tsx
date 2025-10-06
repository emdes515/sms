'use client';

interface LoginLayoutProps {
	children: React.ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
	return <div className="min-h-screen bg-gray-50">{children}</div>;
};

export default LoginLayout;
