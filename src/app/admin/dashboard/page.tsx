'use client';

import Link from 'next/link';
import { Package, Truck } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';

export default function AdminDashboard() {
  return (
    <AdminShell title="Dashboard">
      <p className="mb-8 text-on-surface-variant">Bem-vindo ao painel administrativo da Essência Floral.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/buques"
          className="flex items-center gap-4 rounded-xl border border-outline-variant/40 bg-surface-white p-6 shadow-sm transition hover:border-primary/40"
        >
          <Package className="size-8 text-primary" />
          <div>
            <p className="font-semibold text-on-surface">Buquês</p>
            <p className="text-sm text-on-surface-variant">Gerir produtos e stock</p>
          </div>
        </Link>
        <Link
          href="/admin/entregas"
          className="flex items-center gap-4 rounded-xl border border-outline-variant/40 bg-surface-white p-6 shadow-sm transition hover:border-primary/40"
        >
          <Truck className="size-8 text-primary" />
          <div>
            <p className="font-semibold text-on-surface">Entregas</p>
            <p className="text-sm text-on-surface-variant">Acompanhar pedidos</p>
          </div>
        </Link>
      </div>
    </AdminShell>
  );
}
