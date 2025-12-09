import { useState } from "react";
import { Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/consumer/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  type NotificationOut,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const NotificationBell = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadNotificationCount,
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const { data: notifications } = useQuery<NotificationOut[]>({
    queryKey: ["notifications", "list"],
    queryFn: () => fetchNotifications(0, 20),
    enabled: !!user,
    staleTime: 60_000,
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    },
  });

  if (!user) return null;

  const handleNotificationClick = (n: NotificationOut) => {
    // Route AUCTION_* notifications to their related object when possible
    if (
      n.type === "AUCTION_WON" ||
      n.type === "AUCTION_OUTBID" ||
      n.type === "AUCTION_ENDED"
    ) {
      if (n.related_object_type === "auction" && n.related_object_id) {
        navigate(`/auction/${n.related_object_id}`);
        setOpen(false);
        return;
      }
    }

    // Route payment/order related notifications
    if (n.type === "ORDER_UPDATE" || n.type === "PAYMENT_RECEIVED") {
      if (n.related_object_type === "auction" && n.related_object_id) {
        navigate(`/auction/${n.related_object_id}`);
        setOpen(false);
        return;
      }
      if (n.related_object_type === "order") {
        navigate("/orders");
        setOpen(false);
        return;
      }
    }

    // Route contract-related notifications to the appropriate dashboard
    if (n.related_object_type === "contract") {
      const role = user?.role;
      if (role === "seller" || role === "fpo") {
        navigate("/dashboard/seller/contracts");
        setOpen(false);
        return;
      }
      if (role === "admin" || role === "consumer" || role === "transporter") {
        navigate("/dashboard/institution");
        setOpen(false);
        return;
      }
    }

    // Default: no navigation, just keep the dropdown open
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      // When opening, refetch notifications so new ones appear without relogin
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    }
    if (next && unreadCount > 0 && !markAllMutation.isPending) {
      markAllMutation.mutate();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border bg-white shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
            <span className="text-sm font-semibold">Notifications</span>
            {markAllMutation.isPending && (
              <span className="text-[10px] text-muted-foreground">Updating…</span>
            )}
          </div>

          {(notifications ?? []).length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              No notifications yet.
            </div>
          )}

          <ul className="divide-y text-sm">
            {(notifications ?? []).map((n) => (
              <li
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "px-4 py-3 flex flex-col gap-0.5 hover:bg-muted/40 cursor-pointer",
                  !n.is_read && "bg-amber-50"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-xs line-clamp-1">{n.title}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
