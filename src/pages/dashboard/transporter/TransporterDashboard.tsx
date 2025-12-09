import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { LogisticsJobSummary, acceptLogisticsJob } from "@/lib/api";

const TransporterDashboard = () => {
  const [jobIdInput, setJobIdInput] = useState("");
  const [lastAcceptedJob, setLastAcceptedJob] = useState<LogisticsJobSummary | null>(null);
  const [demoJobs, setDemoJobs] = useState<
    { id: string; source: string; destination: string; fee: number; status: "PENDING" | "ACCEPTED" | "REJECTED" }[]
  >([
    {
      id: "DEMO-AUCTION-101",
      source: "Seller warehouse · Auction lot #101",
      destination: "Buyer hub · Jaipur",
      fee: 8200,
      status: "PENDING",
    },
    {
      id: "DEMO-CONTRACT-24",
      source: "FPO collection center · Bulk Contract #24",
      destination: "Institutional buyer · Bengaluru campus",
      fee: 14500,
      status: "PENDING",
    },
  ]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const acceptJobMutation = useMutation({
    mutationFn: async (jobId: number) => acceptLogisticsJob(jobId),
    onSuccess: (job) => {
      setLastAcceptedJob(job);
    },
  });

  const handleAcceptJob = () => {
    const parsed = parseInt(jobIdInput, 10);
    if (!parsed || Number.isNaN(parsed)) return;
    acceptJobMutation.mutate(parsed);
  };

  const handleDemoJobAction = (jobId: string, action: "ACCEPT" | "REJECT") => {
    setDemoJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: action === "ACCEPT" ? "ACCEPTED" : "REJECTED" }
          : job,
      ),
    );

    const verb = action === "ACCEPT" ? "accepted" : "rejected";
    setNotifications((prev) => [
      `Buyer notification: Transporter ${verb} logistics job ${jobId} (simulated).`,
      ...prev,
    ].slice(0, 4));
  };

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <Navigation />
      <main className="container px-4 py-8 md:px-6 lg:px-10 space-y-6">
        <div className="rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_24px_60px_rgba(95,79,54,0.12)]">
          <h1 className="text-2xl font-semibold text-[#1F2D3D] mb-2">Transporter Dashboard</h1>
          <p className="text-sm text-[#7A6A58]">
            View and accept logistics jobs created for shipments, then coordinate pickup and delivery.
          </p>
        </div>

        <section className="rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_18px_40px_rgba(95,79,54,0.10)] space-y-4">
          <h2 className="text-lg font-semibold text-[#1F2D3D]">Accept logistics job</h2>
          <p className="text-xs text-[#7A6A58]">
            Enter the job ID shared by the seller or system. When you accept, this job will be assigned to your
            transporter account.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              min={1}
              className="w-40 rounded-md border border-[#E6DFD4] px-3 py-1.5 text-sm"
              placeholder="Job ID"
              value={jobIdInput}
              onChange={(e) => setJobIdInput(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAcceptJob}
              disabled={acceptJobMutation.isPending || !jobIdInput}
              className="inline-flex items-center rounded-full bg-[#2E7D32] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#256428] disabled:opacity-60"
            >
              {acceptJobMutation.isPending ? "Accepting…" : "Accept Job"}
            </button>
            {acceptJobMutation.isError && (
              <span className="text-xs text-red-600">
                {(acceptJobMutation.error as Error)?.message || "Failed to accept job"}
              </span>
            )}
          </div>

          {lastAcceptedJob && (
            <div className="mt-4 rounded-2xl border border-[#E6DFD4] bg-[#FFF8EC] p-4 text-xs text-[#5B4D3B] space-y-1">
              <p className="text-sm font-semibold text-[#1F2D3D]">Last accepted job</p>
              <p>
                Job <span className="font-semibold">#{lastAcceptedJob.id}</span> · Shipment
                <span className="font-semibold"> #{lastAcceptedJob.shipment_id}</span>
              </p>
              <p>
                Fee: <span className="font-semibold">₹{Number(lastAcceptedJob.delivery_fee).toLocaleString()}</span>
              </p>
              <p>
                Status: <span className="font-semibold uppercase">{lastAcceptedJob.status}</span>
              </p>
            </div>
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_18px_40px_rgba(95,79,54,0.10)] space-y-3">
            <h2 className="text-lg font-semibold text-[#1F2D3D]">Simulated jobs from seller & institutional flows</h2>
            <p className="text-xs text-[#7A6A58]">
              These jobs are frontend-only demos to show how seller auctions and institutional contracts could feed into
              transporter workflows. Accept/Reject only updates local state.
            </p>
            <div className="space-y-3 text-xs text-[#5B4D3B]">
              {demoJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-[#F1E7DA] bg-[#FBF6ED] p-3 space-y-1"
                >
                  <p className="text-sm font-semibold text-[#1F2D3D]">{job.id}</p>
                  <p>
                    From: <span className="font-semibold">{job.source}</span>
                  </p>
                  <p>
                    To: <span className="font-semibold">{job.destination}</span>
                  </p>
                  <p>
                    Fee: <span className="font-semibold">₹{job.fee.toLocaleString()}</span>
                  </p>
                  <p>
                    Status: {" "}
                    <span className="font-semibold">
                      {job.status === "PENDING" ? "Pending decision" : job.status === "ACCEPTED" ? "Accepted" : "Rejected"}
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoJobAction(job.id, "ACCEPT")}
                      disabled={job.status !== "PENDING"}
                      className="inline-flex items-center rounded-full bg-[#2E7D32] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#256428] disabled:opacity-60"
                    >
                      Accept (demo)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoJobAction(job.id, "REJECT")}
                      disabled={job.status !== "PENDING"}
                      className="inline-flex items-center rounded-full border border-[#E6DFD4] bg-white px-3 py-1 text-[11px] font-semibold text-[#7A6A58] hover:bg-[#FFF8EC] disabled:opacity-60"
                    >
                      Reject (demo)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E6DFD4] bg-white/95 p-6 shadow-[0_18px_40px_rgba(95,79,54,0.10)] space-y-3 text-xs text-[#5B4D3B]">
            <h2 className="text-lg font-semibold text-[#1F2D3D]">Buyer notifications (simulated)</h2>
            <p className="text-xs text-[#7A6A58]">
              When you act on demo jobs, we push a short message here representing what a buyer notification could look
              like.
            </p>
            {notifications.length === 0 ? (
              <p className="text-[11px] text-[#B09782]">No simulated notifications yet.</p>
            ) : (
              <ul className="space-y-1">
                {notifications.map((note, idx) => (
                  <li
                    key={`${note}-${idx}`}
                    className="rounded-xl border border-[#E6DFD4] bg-[#FFF8EC] px-3 py-2"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TransporterDashboard;
