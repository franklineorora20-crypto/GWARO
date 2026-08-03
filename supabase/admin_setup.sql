-- Run in Supabase SQL Editor after creating an admin user (Authentication → Users).
-- Add that user's UUID to admin_users.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Admins can read admin_users"
  on public.admin_users for select
  to authenticated
  using (auth.uid() = user_id);

-- Orders: public can insert (booking) and read (tracking); only admins mutate/delete.
alter table public."Orders" enable row level security;

alter table public."Orders"
  add column if not exists email text,
  add column if not exists mpesa_phone text,
  add column if not exists mpesa_amount numeric,
  add column if not exists checkout_request_id text,
  add column if not exists merchant_request_id text,
  add column if not exists mpesa_receipt_number text,
  add column if not exists transaction_date timestamptz,
  add column if not exists payment_status_reason text;

drop policy if exists "Public read orders" on public."Orders";
drop policy if exists "Public insert orders" on public."Orders";
drop policy if exists "Admin update orders" on public."Orders";
drop policy if exists "Admin delete orders" on public."Orders";

create policy "Public read orders"
  on public."Orders" for select
  to anon, authenticated
  using (true);

create policy "Public insert orders"
  on public."Orders" for insert
  to anon, authenticated
  with check (true);

create policy "Admin update orders"
  on public."Orders" for update
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admin delete orders"
  on public."Orders" for delete
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Additional safe schema improvements for existing Orders data
-- Create indexes to speed lookups by tracking, status, and payment reference
create index if not exists idx_orders_tracking_id on public."Orders" (tracking_id);
create index if not exists idx_orders_phone on public."Orders" (phone);
create index if not exists idx_orders_status on public."Orders" (status);
create index if not exists idx_orders_payment_status on public."Orders" (paymentStatus);
create index if not exists idx_orders_checkout_request_id on public."Orders" (checkout_request_id);
create index if not exists idx_orders_merchant_request_id on public."Orders" (merchant_request_id);

-- Add safe check constraints in NOT VALID mode to avoid blocking existing rows
alter table public."Orders"
  add constraint orders_total_price_non_negative check (totalPrice >= 0) not valid,
  add constraint orders_status_valid check (status in (
    'Order Received', 'Picked Up', 'Delivered', 'Completed', 'Cancelled', 'Pending', 'In Transit'
  )) not valid,
  add constraint orders_payment_status_valid check (paymentStatus in (
    'Paid via M-Pesa', 'Pending M-Pesa', 'Failed M-Pesa', 'Cancelled M-Pesa', 'Pay on Delivery'
  )) not valid;

-- Example: grant admin (replace with your auth user id)
-- insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000000');
