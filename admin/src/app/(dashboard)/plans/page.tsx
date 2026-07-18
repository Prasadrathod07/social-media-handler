"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createPlan, listPlans } from "@/lib/adminApi";
import { Cadence, Platform, SubscriptionPlan } from "@/types";

const platformOptions: Platform[] = ["linkedin", "x", "instagram", "facebook", "blog"];

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cadence: "weekly" as Cadence,
    price: 0,
    postsPerCycle: 4,
    platformsIncluded: ["linkedin"] as Platform[],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listPlans().then(setPlans);
  }, []);

  function togglePlatform(p: Platform) {
    setForm((f) => ({
      ...f,
      platformsIncluded: f.platformsIncluded.includes(p)
        ? f.platformsIncluded.filter((x) => x !== p)
        : [...f.platformsIncluded, p],
    }));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const plan = await createPlan({ ...form, features: [] });
      setPlans((prev) => [...prev, plan]);
      setShowForm(false);
      setForm({ name: "", cadence: "weekly", price: 0, postsPerCycle: 4, platformsIncluded: ["linkedin"] });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Plans & pricing</h1>
          <p className="mt-1 text-sm text-muted">Packages are tied to posting cadence.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-4 w-4" />
          New plan
        </Button>
      </div>

      {showForm ? (
        <Card className="mt-5">
          <form onSubmit={onCreate} className="grid grid-cols-2 gap-4">
            <Input
              label="Plan name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Cadence</label>
              <select
                value={form.cadence}
                onChange={(e) => setForm((f) => ({ ...f, cadence: e.target.value as Cadence }))}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <Input
              label="Price (USD/mo)"
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              required
            />
            <Input
              label="Posts per cycle"
              type="number"
              min={1}
              value={form.postsPerCycle}
              onChange={(e) => setForm((f) => ({ ...f, postsPerCycle: Number(e.target.value) }))}
              required
            />
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Platforms included</label>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      form.platformsIncluded.includes(p)
                        ? "bg-brand-500 text-white"
                        : "bg-black/5 text-foreground/70 dark:bg-white/5"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Create plan
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan._id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{plan.name}</p>
                <p className="text-sm text-muted capitalize">{plan.cadence} posting</p>
              </div>
              <Badge label={plan.active ? "Active" : "Inactive"} tone={plan.active ? "success" : "neutral"} />
            </div>
            <p className="mt-4 text-2xl font-semibold">
              ${plan.price}
              <span className="text-sm font-normal text-muted">/mo</span>
            </p>
            <p className="mt-1 text-xs text-muted">{plan.postsPerCycle} posts per cycle</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {plan.platformsIncluded.map((p) => (
                <Badge key={p} label={p} tone="brand" />
              ))}
            </div>
          </Card>
        ))}
        {plans.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">No plans yet. Create one to get started.</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
