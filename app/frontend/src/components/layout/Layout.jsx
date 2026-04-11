import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout({ children, title, breadcrumb }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#111211]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
