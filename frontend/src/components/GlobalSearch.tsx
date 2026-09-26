import React, { useEffect } from "react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFinanceData } from "@/hooks/useFinanceData";

export const GlobalSearch = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { transactions, profile } = useFinanceData();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Command
            className="flex h-[400px] w-full flex-col overflow-hidden rounded-2xl bg-[#111] text-white border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            loop
          >
            <div className="flex items-center border-b border-white/10 px-4">
              <Search className="mr-2 h-5 w-5 shrink-0 text-white/50" />
              <Command.Input
                placeholder="Search transactions, amounts, or notes..."
                className="flex h-14 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="flex-1 overflow-y-auto overflow-x-hidden p-2 scrollbar-hide">
              <Command.Empty className="py-12 text-center text-sm text-white/50">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Search className="size-6 text-white/30" />
                  </div>
                  <p>No results found for your search.</p>
                </div>
              </Command.Empty>

              <Command.Group heading="Transactions">
                {transactions.map((tx) => (
                  <Command.Item
                    key={tx.id}
                    value={`${tx.merchant} ${tx.amount} ${tx.notes || ""} ${tx.transaction_type}`}
                    onSelect={() => runCommand(() => navigate(`/dashboard/transactions`))}
                    className="relative flex cursor-pointer select-none items-center rounded-xl px-4 py-3 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/5 mr-4 shrink-0">
                      {tx.transaction_type === "income" ? (
                        <TrendingUp className="size-5 text-flux-lime" />
                      ) : (
                        <TrendingDown className="size-5 text-flux-pink" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-white">{tx.merchant}</p>
                      <p className="text-xs text-white/50 truncate">
                        {tx.notes ? `${tx.notes} • ` : ""}
                        {new Date(tx.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p
                        className={`font-semibold ${tx.transaction_type === "income" ? "text-flux-lime" : "text-white"}`}
                      >
                        {tx.transaction_type === "income" ? "+" : "-"}
                        {profile.currency}
                        {tx.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
