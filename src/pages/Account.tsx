import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, LogOut, Package, Settings } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

const Account = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      const user = session.user;
      setProfile({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || "",
        created_at: user.created_at,
      });
      setEditName(user.user_metadata?.full_name || "");
      setLoading(false);
    });
  }, []);

  const saveName = async () => {
    setSaving(true);
    await supabase.auth.updateUser({ data: { full_name: editName } });
    setProfile(prev => prev ? { ...prev, full_name: editName } : prev);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-toyo-dark py-12 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-toyo-red/20 flex items-center justify-center">
              <User className="w-7 h-7 text-toyo-red" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{profile?.full_name || "My Account"}</h1>
              <p className="text-gray-400 text-sm">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings className="w-4 h-4 text-gray-500" />
            <h2 className="font-bold text-gray-900">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
              <div className="flex gap-3">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-toyo-red"
                  placeholder="Your full name"
                />
                <button
                  onClick={saveName}
                  disabled={saving}
                  className="px-4 py-2.5 bg-toyo-red text-white text-sm font-semibold rounded-lg hover:bg-toyo-red-dark transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <div className="flex items-center gap-3 border border-gray-100 rounded-lg px-4 py-2.5 bg-gray-50">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{profile?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Browse Products", desc: "View our full product catalog", href: "/products", icon: Package },
              { label: "Downloads", desc: "Catalogs, manuals & CAD files", href: "/download", icon: Package },
              { label: "Technical Support", desc: "Model selection software", href: "/technical", icon: Settings },
              { label: "Contact Us", desc: "Get in touch with our team", href: "/contact", icon: Mail },
            ].map(item => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-toyo-red hover:shadow-sm transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-toyo-red/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-toyo-red" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-toyo-red transition-colors">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Member since */}
        <p className="text-center text-xs text-gray-400">
          Member since {new Date(profile?.created_at || "").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
        </p>
      </div>
    </div>
  );
};

export default Account;
