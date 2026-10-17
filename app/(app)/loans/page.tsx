import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoanActions } from "@/components/loan-controls";
import { StatusBadge, cardClass, emptyBoxClass, formatDate } from "@/components/ui";
import { listLoans } from "@/lib/data/loans";
import type { Loan, LoanStatus } from "@/lib/types";
import { requireWebUser } from "@/lib/web/session";

export const metadata: Metadata = { title: "Préstamos" };

function actionsFor(loan: Loan): ("approve" | "reject" | "return")[] {
  if (loan.status === "requested") return ["approve", "reject"];
  if (loan.status === "approved") return ["return"];
  return [];
}

const SUMMARY: { status: LoanStatus; label: string; tone: string }[] = [
  { status: "requested", label: "Solicitudes pendientes", tone: "bg-chip text-on-chip" },
  { status: "approved", label: "Prestados", tone: "bg-brand text-on-brand" },
  { status: "rejected", label: "Rechazados", tone: "border border-line bg-surface text-accent" },
  { status: "returned", label: "Devueltos", tone: "border border-line bg-surface text-accent" },
];

async function LoanList() {
  const user = await requireWebUser();
  const loans = await listLoans(user);
  const librarian = user.role === "librarian";

  if (loans.length === 0) {
    return (
      <p className={emptyBoxClass}>
        {librarian ? "Aún no hay solicitudes." : "Todavía no has solicitado libros."}{" "}
        <Link href="/books" className="font-semibold text-accent underline">
          Ver catálogo
        </Link>
      </p>
    );
  }

  return (
    <>
      <ul className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Resumen de préstamos">
        {SUMMARY.map(({ status, label, tone }) => (
          <li key={status} className={`rounded-2xl px-4 py-4 ${tone}`}>
            <p className="text-[13px]">{label}</p>
            <p className="font-serif text-3xl font-bold">
              {loans.filter((l) => l.status === status).length}
            </p>
          </li>
        ))}
      </ul>

      <ul className="flex flex-col gap-3.5">
        {loans.map((loan) => (
          <li
            key={loan.id}
            className={`${cardClass} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
            <div className="flex min-w-0 flex-col gap-1">
              <Link
                href={`/books/${loan.bookId}`}
                className="font-serif text-xl font-bold text-accent hover:underline">
                {loan.bookTitle}
              </Link>
              {librarian && (
                <p className="text-sm text-muted">
                  {loan.userName} · {loan.userEmail}
                </p>
              )}
              <p className="text-[13px] text-muted">
                Solicitado {formatDate(loan.requestedAt)}
                {loan.status === "approved" && ` · Entrega ${formatDate(loan.dueDate)}`}
                {loan.status === "returned" && ` · Devuelto ${formatDate(loan.returnedAt)}`}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <StatusBadge status={loan.status} />
              {librarian && actionsFor(loan).length > 0 && (
                <LoanActions loanId={loan.id} actions={actionsFor(loan)} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function LoansPage() {
  return (
    <>
      <div className="mb-7 flex flex-col gap-2">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-accent">
          Préstamos
        </h1>
        <p className="text-base text-muted">
          Revisa el estado de las solicitudes y los libros prestados.
        </p>
      </div>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-line" aria-busy />}>
        <LoanList />
      </Suspense>
    </>
  );
}
