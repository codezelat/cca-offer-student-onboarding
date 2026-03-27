import Image from "next/image";
import { notFound } from "next/navigation";
import { ReceiptDownloadTrigger } from "@/components/receipt-download-trigger";
import { prisma } from "@/lib/db";
import { formatCurrency, formatSimpleDate } from "@/lib/utils";
import { publicCopy } from "@/lib/content/public";
import { supportContact } from "@/lib/config";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ download?: string }>;
};

export default async function ReceiptPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { download } = await searchParams;
  const studentId = Number(id);

  if (!studentId) {
    return notFound();
  }

  const record = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!record) {
    return notFound();
  }

  // Fetch all sister records to show all IDs if multi-program
  const baseRegId = record.registration_id.split("-")[0];
  const allRecords = await prisma.student.findMany({
    where: {
      OR: [
        { registration_id: baseRegId },
        { registration_id: { startsWith: `${baseRegId}-` } },
      ],
    },
    orderBy: { registration_id: "asc" },
  });

  const bootcampNames = allRecords.map((r) => r.selected_diploma);
  const allRegIds = allRecords.map((r) => r.registration_id);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 font-sans text-neutral-900 print:p-0">
      <div className="mx-auto max-w-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-12 print:border-none print:shadow-none">
        {download === "true" ? (
          <ReceiptDownloadTrigger href={`/payment/receipt/${record.id}/download`} />
        ) : null}
        
        {/* Header */}
        <div className="flex flex-col items-center border-b-2 border-neutral-900 pb-8 text-center italic">
          <Image
            src="/images/logo-set-line-sub.png"
            alt="CCA and SITC Logos"
            width={400}
            height={80}
            className="h-16 w-auto"
            priority
          />
          <h1 className="mt-6 text-2xl font-black uppercase tracking-[0.2em] text-neutral-900">
            Official Registration Receipt
          </h1>
          <p className="mt-1 text-sm font-bold text-neutral-500 uppercase tracking-widest">
            CCA Education Programs — Powered by Codezela
          </p>
        </div>

        {/* Content */}
        <div className="mt-12 space-y-10">
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Receipt Number
              </h2>
              <p className="mt-1 font-mono text-sm">REC-{record.registration_id.replace(/\//g, "-")}</p>
            </section>
            <section className="sm:text-right">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Issued Date
              </h2>
              <p className="mt-1 text-sm font-semibold">{formatSimpleDate(record.payment_date || new Date())}</p>
            </section>
          </div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-900 p-8 text-white shadow-xl shadow-neutral-900/10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
              Assigned Registration ID(s)
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {allRegIds.map(id => (
                <span key={id} className="rounded-lg bg-white/20 px-4 py-2 text-xl font-black tracking-tighter">
                  {id}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-neutral-400 font-medium">
              Important: Please save these IDs for all future academic and administrative communications.
            </p>
          </div>

          <section className="space-y-6">
            <h3 className="border-b border-neutral-100 pb-2 text-xs font-black uppercase tracking-widest text-neutral-900">
              Student Information
            </h3>
            <div className="grid gap-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Full Name</span>
                <span className="font-bold text-right pl-4">{record.full_name}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-50 pt-4">
                <span className="text-neutral-500">NIC Number</span>
                <span className="font-bold">{record.nic}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-50 pt-4">
                <span className="text-neutral-500">Email Address</span>
                <span className="font-bold">{record.email}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-50 pt-4">
                <span className="text-neutral-500">WhatsApp</span>
                <span className="font-bold">{record.whatsapp_number}</span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="border-b border-neutral-100 pb-2 text-xs font-black uppercase tracking-widest text-neutral-900">
              Registration Fee Summary
            </h3>
            <div className="overflow-hidden rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  <tr>
                    <th className="px-6 py-3">Program Description</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 italic">
                  {bootcampNames.map((name) => (
                    <tr key={name}>
                      <td className="px-6 py-4 font-medium">{name} Registration</td>
                      <td className="px-6 py-4 text-right">Rs. 3,000.00</td>
                    </tr>
                  ))}
                  <tr className="bg-neutral-900 text-white not-italic">
                    <td className="px-6 py-4 font-bold">Total Registration Fee Paid</td>
                    <td className="px-6 py-4 text-right text-lg font-black italic">
                      Rs. {(3000 * bootcampNames.length).toLocaleString()}.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Payment Submitted</h4>
                <p className="text-xs text-emerald-700 mt-0.5">Submitted via {record.payment_method === 'online' ? 'PayHere Secure Gateway' : 'Bank Slip Verification'}</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-neutral-200 pt-10 text-center">
            <p className="text-[10px] font-medium leading-relaxed text-neutral-400">
              This is an official computer-generated digital receipt issued by CCA Campus and SITC Campus. 
              No physical signature is required. For any inquiries, please contact our support at {supportContact.whatsapp}.
            </p>
            <div className="mt-8 flex justify-center no-print">
              <a
                href={`/payment/receipt/${record.id}/download`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
              >
                Download Receipt PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
