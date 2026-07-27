'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Building2, Users, MapPin, CheckCircle, Tv, Mic, Monitor, Coffee, Video } from 'lucide-react';

interface Room {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  capacity: number;
  location_ar: string;
  location_en: string;
  amenities: string[];
  color: string;
  is_active: boolean;
}

interface RoomsDirectoryProps {
  rooms: Room[];
  onSelectRoomForBooking: (roomId: number) => void;
}

const EQUIPMENT_ICONS: Record<string, { labelAr: string; labelEn: string; icon: any }> = {
  projector: { labelAr: 'بروجكتور', labelEn: 'Projector', icon: Tv },
  soundSystem: { labelAr: 'نظام صوتي', labelEn: 'Sound System', icon: Mic },
  whiteboard: { labelAr: 'سبورة تفاعلية', labelEn: 'Whiteboard', icon: Monitor },
  videoconf: { labelAr: 'فيديو كونفرانس', labelEn: 'Video Conf', icon: Video },
  hospitality: { labelAr: 'ضيافة ومشروبات', labelEn: 'Hospitality', icon: Coffee },
  laptops: { labelAr: 'أجهزة كمبيوتر', labelEn: 'Laptops', icon: Monitor },
};

export const RoomsDirectory: React.FC<RoomsDirectoryProps> = ({ rooms, onSelectRoomForBooking }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-6 rounded-3xl border border-[var(--stroke)] shadow-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#7DA9FF]" />
          {t.rooms.title}
        </h2>
        <p className="text-xs text-[#A2A7B3] mt-1 font-sans">دليل القاعات التدريبية والاجتماعات المتاحة بالشركة والتجهيزات التقنية المتاحة بكل قاعة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => {
          const name = lang === 'ar' ? room.name_ar : room.name_en;
          const loc = lang === 'ar' ? room.location_ar : room.location_en;

          return (
            <div
              key={room.id}
              className="glass-panel glass-panel-hover p-6 rounded-3xl border border-[var(--stroke)] flex flex-col justify-between shadow-2xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--stroke)]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-10 rounded-full shadow-[0_0_12px_currentColor]"
                      style={{ backgroundColor: room.color, color: room.color }}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{name}</h3>
                      <span className="text-xs text-[#7DA9FF] font-mono">
                        CODE: {room.code}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[rgba(74,222,128,0.1)] text-[#4ADE80] border border-[rgba(74,222,128,0.3)] font-mono text-xs font-bold">
                    ● READY
                  </span>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 py-4 text-xs font-mono text-[#A2A7B3]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#7DA9FF]" />
                    <span>CAPACITY: {room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7DA9FF]" />
                    <span>{loc}</span>
                  </div>
                </div>

                {/* Equipment Badges */}
                <div className="pt-2">
                  <h4 className="text-[11px] font-mono font-semibold text-[#626772] mb-2 uppercase tracking-wider">
                    EQUIPMENT & AMENITIES:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(room.amenities || []).map((eq) => {
                      const eqInfo = EQUIPMENT_ICONS[eq];
                      const label = eqInfo ? (lang === 'ar' ? eqInfo.labelAr : eqInfo.labelEn) : eq;

                      return (
                        <span
                          key={eq}
                          className="cloud-pill hl"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#4ADE80]" />
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-6 border-t border-[var(--stroke)]">
                <button
                  onClick={() => onSelectRoomForBooking(room.id)}
                  className="w-full py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[#F4F5F7] border border-[var(--stroke)] hover:border-white text-white hover:text-[#07080B] text-xs font-bold transition-all shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                >
                  حجز هذه القاعة الآن →
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
