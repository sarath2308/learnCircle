import { CalendarDays, Plus, Search, BellRing, ArrowRight } from "lucide-react";

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Events</h1>
          <p className="text-slate-500 font-medium">
            Live workshops, webinars, and community meetups.
          </p>
        </div>
      </div>

      {/* Empty State Container */}
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          {/* Animated/Visual Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-6">
            <CalendarDays size={48} className="text-blue-500" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-3">No Upcoming Events</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            It looks like there are no events scheduled at the moment. Check back later or subscribe
            to notifications to be the first to know when a new session is added.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Plus size={20} />
              Host an Event
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
              <BellRing size={18} />
              Notify Me
            </button>
          </div>
        </div>

        {/* Suggested Actions/Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 bg-slate-100/50 rounded-2xl border border-slate-200 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Search size={20} className="text-slate-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Browse Past Events</h4>
              <p className="text-sm text-slate-500 mt-1">
                Access recordings of previous webinars and workshops.
              </p>
              <button className="mt-3 text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                View Archive <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="p-6 bg-slate-100/50 rounded-2xl border border-slate-200 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <CalendarDays size={20} className="text-slate-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Request a Topic</h4>
              <p className="text-sm text-slate-500 mt-1">
                Want to learn something specific? Tell our instructors.
              </p>
              <button className="mt-3 text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                Send Request <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
