import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Bell, CheckCircle2, Circle, AlertTriangle, IndianRupee } from "lucide-react";
import { store } from "@/lib/store";
import { useFinanceData } from "@/hooks/useFinanceData";

export const NotificationBell = () => {
  const { notifications } = useFinanceData();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="relative size-9 lg:size-11 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all backdrop-blur-md outline-none">
          <Bell size={16} className="lg:scale-110" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 lg:top-2.5 lg:right-2.5 flex size-4 items-center justify-center rounded-full bg-flux-orange text-[10px] font-bold text-white shadow-[0_0_8px_rgba(255,123,0,0.8)]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[100] w-80 lg:w-96 rounded-2xl bg-[#111] border border-white/10 p-0 text-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => store.markAllNotificationsAsRead()}
                className="text-xs text-flux-orange hover:text-flux-orange/80 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2 scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <CheckCircle2 className="size-6 text-white/30" />
                </div>
                <p className="text-sm font-medium text-white/70">You're all caught up!</p>
                <p className="text-xs text-white/40 mt-1">No new notifications right now.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
                      notif.is_read ? "bg-transparent opacity-60" : "bg-white/5"
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0 text-flux-pink">
                      {notif.is_read ? <Circle size={16} /> : <AlertTriangle size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                        {notif.description}
                      </p>
                      <p className="text-[10px] text-white/30 mt-2">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <button
                        onClick={() => store.markNotificationAsRead(notif.id)}
                        className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
