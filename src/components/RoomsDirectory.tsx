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
  projector: { labelAr: 'جهاز عرض بروجكتور', labelEn: 'Projector', icon: Tv },
  soundSystem: { labelAr: 'نظام صوتي ومايكروفون', labelEn: 'Sound System', icon: Mic },
  whiteboard: { labelAr: 'سبورة تفاعلية', labelEn: 'Whiteboard', icon: Monitor },
  videoconf: { labelAr: 'فيديو كونفرانس', labelEn: 'Video Conf', icon: Video },
  hospitality: { labelAr: 'ضيافة ومشروبات', labelEn: 'Hospitality', icon: Coffee },
  laptops: { labelAr: 'أجهزة أجهزة كمبيوتر', labelEn: 'Laptops', icon: Monitor },
};

export const RoomsDirectory: React.FC<RoomsDirectoryProps> = ({ rooms, onSelectRoomForBooking }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-6 rounded-3xl border border-indigo-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600" />
          {t.rooms.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1">دليل القاعات التدريبية والاجتماعات المتاحة بالشركة والتجهيزات التقنية المتاحة بكل قاعة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => {
          const name = lang === 'ar' ? room.name_ar : room.name_en;
          const loc = lang === 'ar' ? room.location_ar : room.location_en;

          return (
            <div
              key={room.id}
              className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-12 rounded-full"
                      style={{ backgroundColor: room.color }}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                      <span className="text-xs text-indigo-600 font-mono font-semibold">
                        كود: {room.code}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                    نشطة وجاهزة
                  </span>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 py-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>السعة: {room.capacity} فرد</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>{loc}</span>
                  </div>
                </div>

                {/* Equipment Badges */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    التجهيزات التقنية المتوفرة بالقاعة:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(room.amenities || []).map((eq) => {
                      const eqInfo = EQUIPMENT_ICONS[eq];
                      const label = eqInfo ? (lang === 'ar' ? eqInfo.labelAr : eqInfo.labelEn) : eq;

                      return (
                        <span
                          key={eq}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3 h-3 text-indigo-600" />
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => onSelectRoomForBooking(room.id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 text-indigo-700 hover:text-white text-xs font-bold transition-all shadow-xs hover:shadow-md"
                >
                  حجز هذه القاعة الآن
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
