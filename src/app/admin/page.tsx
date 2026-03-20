import AdminAnalyticsPage from './analytics/page';
import AdminRegistrationsPage from './registrations/page';
import AdminCmsEditorAllSections from '@/components/admin/AdminCmsEditorAllSections';

export default function AdminHomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-extrabold text-[#1a2945]">
        Admin Dashboard
      </h1>

      <div className="mt-6 space-y-10">
        <section>
          <AdminAnalyticsPage />
        </section>

        <section>
          <AdminRegistrationsPage />
        </section>

        <section>
          <AdminCmsEditorAllSections />
        </section>
      </div>
    </div>
  );
}
