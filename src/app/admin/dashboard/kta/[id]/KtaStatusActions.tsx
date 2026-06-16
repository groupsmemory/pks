'use client';

import { updateKtaStatus } from '@/src/app/actions/update-kta-status';

export default function KtaStatusActions({ id }: { id: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-gray-900">Aksi Verifikasi</h2>
      </div>
      <div className="p-6 flex flex-wrap gap-4">
        <form action={updateKtaStatus}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="APPROVED" />
          <button
            type="submit"
            className="min-h-[44px] px-6 py-2 font-bold text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors"
          >
            Setujui (Approve)
          </button>
        </form>
        <form action={updateKtaStatus}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="REJECTED" />
          <button
            type="submit"
            className="min-h-[44px] px-6 py-2 font-bold text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
          >
            Tolak (Reject)
          </button>
        </form>
      </div>
    </div>
  );
}
