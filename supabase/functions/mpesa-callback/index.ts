import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


Deno.serve(async (req) => {

  console.log("MPESA CALLBACK FUNCTION HIT");

  try {

    const body = await req.json();

    console.log(
      "CALLBACK BODY:",
      JSON.stringify(body, null, 2)
    );


    const stkCallback =
      body?.Body?.stkCallback;


    if (!stkCallback) {

      console.log("INVALID CALLBACK STRUCTURE");

      return new Response(
        JSON.stringify({
          ResultCode: 0,
          ResultDesc: "Accepted"
        }),
        {
          headers:{
            "Content-Type":"application/json"
          }
        }
      );
    }


    const checkoutRequestId =
      stkCallback.CheckoutRequestID;


    const resultCode =
      stkCallback.ResultCode;


    const resultDesc =
      stkCallback.ResultDesc;


    console.log(
      "CHECKOUT REQUEST ID:",
      checkoutRequestId
    );


    console.log(
      "RESULT CODE:",
      resultCode
    );


    console.log(
      "RESULT DESCRIPTION:",
      resultDesc
    );


    const supabase = createClient(

      Deno.env.get("SUPABASE_URL")!,

      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    );



    // PAYMENT SUCCESS

    if (resultCode === 0) {


      const metadata =
        stkCallback.CallbackMetadata?.Item || [];


      const receipt =
        metadata.find(
          (item:any) =>
          item.Name === "MpesaReceiptNumber"
        )?.Value || null;


      const amount =
        metadata.find(
          (item:any) =>
          item.Name === "Amount"
        )?.Value || null;


      const phone =
        metadata.find(
          (item:any) =>
          item.Name === "PhoneNumber"
        )?.Value || null;



      console.log(
        "MPESA RECEIPT:",
        receipt
      );



    console.log(
  "TRYING PAYMENT UPDATE FOR:",
  checkoutRequestId
);


const { data, error } = await supabase

.from("Orders")

.update({

  paymentStatus:"Paid",

  mpesaRef:receipt,

  mpesa_amount:amount,

  mpesa_phone:phone,

  payment_status_reason:null

})

.eq(
  "checkout_request_id",
  checkoutRequestId
)

.select("*");


console.log(
  "UPDATED DATA:",
  JSON.stringify(data, null, 2)
);


console.log(
  "UPDATE ERROR:",
  JSON.stringify(error, null, 2)
);



      if(error){

        console.error(
          "SUPABASE UPDATE ERROR:",
          error
        );

      }
      else {

        console.log(
          "ORDER UPDATED AS PAID"
        );

      }


    }



    // PAYMENT FAILED

else {

  console.log(
    "TRYING FAILED PAYMENT UPDATE FOR:",
    checkoutRequestId
  );


  const { data, error } = await supabase

  .from("Orders")

  .update({

    paymentStatus:"Payment Failed",

    payment_status_reason:
    resultDesc

  })

  .eq(
    "checkout_request_id",
    checkoutRequestId
  )

  .select("*");



  console.log(
    "FAILED UPDATE DATA:",
    JSON.stringify(data, null, 2)
  );


  console.log(
    "FAILED UPDATE ERROR:",
    JSON.stringify(error, null, 2)
  );


}



    return new Response(

      JSON.stringify({

        ResultCode:0,

        ResultDesc:"Accepted"

      }),

      {

        headers:{

          "Content-Type":
          "application/json"

        }

      }

    );



  }

  catch(error){


    console.error(
      "CALLBACK ERROR:",
      error
    );


    return new Response(

      JSON.stringify({

        ResultCode:0,

        ResultDesc:"Accepted"

      }),

      {

        headers:{

          "Content-Type":
          "application/json"

        }

      }

    );


  }


});