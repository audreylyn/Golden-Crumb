import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase, getWebsiteId } from '../src/lib/supabase';
import type { TeamMember, TeamSectionConfig } from '../src/types/database.types';
import { EditableText } from '../src/components/editor/EditableText';
import { useEditor } from '../src/contexts/EditorContext';

export const Team: React.FC = () => {
  const [config, setConfig] = useState<TeamSectionConfig | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { isEditing, saveField } = useEditor();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const websiteId = await getWebsiteId();
      if (!websiteId) return;

      // Fetch config
      const { data: configData, error: configError } = await supabase
        .from('team_section_config')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (configError) throw configError;
      setConfig(configData as TeamSectionConfig);

      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('website_id', websiteId)
        .order('display_order');

      if (membersError) throw membersError;
      setMembers(membersData as TeamMember[]);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-bakery-cream relative flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bakery-primary mx-auto mb-4"></div>
          <p className="font-sans text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (!config || members.length === 0) return null;

  return (
    <section className="py-24 bg-bakery-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {config.subheading && (
            isEditing ? (
              <EditableText
                value={config.subheading}
                onSave={async (newValue) => {
                  await saveField('team_section_config', 'subheading', newValue, config.id);
                  setConfig({ ...config, subheading: newValue });
                }}
                tag="span"
                className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm block mb-2"
              />
            ) : (
              <span className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm block mb-2">
                {config.subheading}
              </span>
            )
          )}
          {isEditing ? (
            <EditableText
              value={config.heading}
              onSave={async (newValue) => {
                await saveField('team_section_config', 'heading', newValue, config.id);
                setConfig({ ...config, heading: newValue });
              }}
              tag="h2"
              className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark"
            />
          ) : (
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark">
              {config.heading}
            </h2>
          )}
          <div className="w-24 h-1 bg-bakery-sand mx-auto rounded-full mt-6" />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-${config.columns || 3} gap-10`}>
          {members.map((member) => (
            <div key={member.id} className="group relative">
              {/* Image Card */}
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg mb-6">
                <img 
                  src={member.image_url || "https://i.pravatar.cc/500?img=" + member.id} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {member.bio && (
                  <div className="absolute inset-0 bg-gradient-to-t from-bakery-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-bakery-sand font-sans text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      "{member.bio}"
                    </p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center">
                {isEditing ? (
                  <EditableText
                    value={member.name}
                    onSave={async (newValue) => {
                      await saveField('team_members', 'name', newValue, member.id);
                      setMembers(members.map(m => m.id === member.id ? { ...m, name: newValue } : m));
                    }}
                    tag="h3"
                    className="font-serif text-2xl font-bold text-bakery-dark mb-1"
                  />
                ) : (
                  <h3 className="font-serif text-2xl font-bold text-bakery-dark mb-1">{member.name}</h3>
                )}
                {isEditing ? (
                  <EditableText
                    value={member.role}
                    onSave={async (newValue) => {
                      await saveField('team_members', 'role', newValue, member.id);
                      setMembers(members.map(m => m.id === member.id ? { ...m, role: newValue } : m));
                    }}
                    tag="p"
                    className="font-sans text-bakery-primary font-bold text-sm tracking-wide uppercase mb-3"
                  />
                ) : (
                  <p className="font-sans text-bakery-primary font-bold text-sm tracking-wide uppercase mb-3">{member.role}</p>
                )}
                {member.bio && isEditing && (
                  <EditableText
                    value={member.bio}
                    onSave={async (newValue) => {
                      await saveField('team_members', 'bio', newValue, member.id);
                      setMembers(members.map(m => m.id === member.id ? { ...m, bio: newValue } : m));
                    }}
                    tag="p"
                    multiline
                    className="text-sm text-gray-600 mt-2"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};