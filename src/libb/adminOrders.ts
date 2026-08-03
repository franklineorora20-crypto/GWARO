import { supabase } from "../lib/supabase";

export type PaymentStatus =
  | "Paid"
  | "Payment Pending"
  | "Payment Failed"
  | "Pay on Delivery";


export interface AdminOrder {

  dbId: number;

  id: string;

  customerName: string;

  phone: string;

  email?: string;

  branch: string;

  address: string;

  totalPrice: number;

  status: any;

  paymentStatus: PaymentStatus;

  pickupDate?: string;

  timeSlot?: string;

  specialNotes?: string;

  items: any[];

  trackingNotes?: string;

  deliveryType?: string;

  estimatedDelivery?: string;

  trackingId?: string;


  // MPESA DATA

  mpesaReceiptNumber?: string;

  mpesaAmount?: number;

  mpesaPhone?: string;

  checkoutRequestId?: string;

  merchantRequestId?: string;

  paymentStatusReason?: string;


  rawCreatedAt: string;
}



export async function fetchAdminOrders(): Promise<AdminOrder[]> {


  const {data,error}=await supabase
    .from("Orders")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    );


  if(error){

    console.error(
      "FETCH ORDERS ERROR",
      error
    );

    throw error;

  }



  return data.map((order:any)=>({


    dbId:order.id,

    id:order.tracking_id,


    customerName:
      order.customerName,


    phone:
      order.phone,


    email:
      order.email,


    branch:
      order.branch,


    address:
      order.address,


    totalPrice:
      order.totalPrice,


    status:
      order.status,


    paymentStatus:
      order.paymentStatus,


    pickupDate:
      order.pickupDate,


    timeSlot:
      order.timeSlot,


    specialNotes:
      order.specialNotes,


    items:
      order.items || [],


    trackingNotes:
      order.trackingNotes,


    deliveryType:
      order.deliveryType,


    estimatedDelivery:
      order.estimatedDelivery,


    trackingId:
      order.tracking_id,



    // M-PESA

    mpesaReceiptNumber:
      order.mpesaRef,


    mpesaAmount:
      order.mpesa_amount,


    mpesaPhone:
      order.mpesa_phone,


    checkoutRequestId:
      order.checkout_request_id,


    merchantRequestId:
      order.merchant_request_id,


    paymentStatusReason:
      order.payment_status_reason,


    rawCreatedAt:
      order.created_at


  }));

}




export async function updateOrderStatus(
  id: number,
  status: string
) {

  console.log(
    "UPDATING ORDER:",
    {
      databaseId: id,
      newStatus: status
    }
  );


  const { data, error } = await supabase
    .from("Orders")
    .update({
      status
    })
    .eq("id", id)
    .select();


  console.log(
    "SUPABASE UPDATE RESPONSE:",
    {
      data,
      error
    }
  );


  if (error) {
    throw error;
  }


  if (!data || data.length === 0) {

    throw new Error(
      "No order updated. Check database ID or RLS policy."
    );

  }


  return data[0];

}





export async function updateOrderPaymentStatus(
 id:number,
 paymentStatus:string
){

 const {error}=await supabase
 .from("Orders")
 .update({
   paymentStatus
 })
 .eq(
   "id",
   id
 );


 if(error)
 throw error;

}





export async function deleteOrderById(
 id:number
){

 const {error}=await supabase
 .from("Orders")
 .delete()
 .eq(
   "id",
   id
 );


 if(error)
 throw error;

}