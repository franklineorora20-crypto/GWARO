import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {

  console.log("MPESA CALLBACK FUNCTION HIT");

  console.log(
    "REQUEST METHOD:",
    req.method
  );

  console.log(
    "CONTENT TYPE:",
    req.headers["content-type"]
  );


  try {

    const callbackData = req.body;


    console.log(
      "CALLBACK BODY:",
      JSON.stringify(callbackData, null, 2)
    );


    // Check empty callback
    if (!callbackData) {

      console.log(
        "EMPTY CALLBACK BODY RECEIVED"
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted"
      });
    }


    const stkCallback =
      callbackData?.Body?.stkCallback;


    if (!stkCallback) {

      console.log(
        "INVALID CALLBACK STRUCTURE"
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted"
      });
    }


    const checkoutRequestId =
      stkCallback.CheckoutRequestID;


    const resultCode =
      stkCallback.ResultCode;


    const resultDescription =
      stkCallback.ResultDesc;


    console.log(
      "RESULT CODE:",
      resultCode
    );


    console.log(
      "RESULT DESCRIPTION:",
      resultDescription
    );


    console.log(
      "CHECKOUT ID:",
      checkoutRequestId
    );



    // Connect Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );



    if (resultCode === 0) {


      console.log(
        "PAYMENT SUCCESS"
      );


      const metadata =
        stkCallback.CallbackMetadata?.Item || [];


      console.log(
        "CALLBACK METADATA:",
        JSON.stringify(metadata, null, 2)
      );



      const receipt =
        metadata.find(
          item =>
          item.Name === "MpesaReceiptNumber"
        )?.Value || null;



      const amount =
        metadata.find(
          item =>
          item.Name === "Amount"
        )?.Value || null;



      const phone =
        metadata.find(
          item =>
          item.Name === "PhoneNumber"
        )?.Value || null;



      const transactionDate =
        metadata.find(
          item =>
          item.Name === "TransactionDate"
        )?.Value || null;



      console.log(
        "MPESA RECEIPT:",
        receipt
      );


      console.log(
        "MPESA AMOUNT:",
        amount
      );


      console.log(
        "MPESA PHONE:",
        phone
      );


      console.log(
        "TRANSACTION DATE:",
        transactionDate
      );



      const updateData = {

        paymentStatus: "Paid",

        mpesaRef: receipt,

        mpesa_amount: amount,

        mpesa_phone: phone,

        payment_status_reason: null

      };



      console.log(
        "UPDATING ORDER:",
        updateData
      );


      console.log(
        "SEARCH CHECKOUT ID:",
        checkoutRequestId
      );



      const { data, error } = await supabase

        .from("Orders")

        .update(updateData)

        .eq(
          "checkout_request_id",
          checkoutRequestId
        )

        .select();



      console.log(
        "UPDATE RESULT:",
        data
      );


      console.log(
        "UPDATE ERROR:",
        error
      );



      if(error){

        console.error(
          "SUPABASE UPDATE FAILED:",
          error
        );

      }
      else {

        console.log(
          "PAYMENT SUCCESS UPDATED"
        );

      }



    } else {


      console.log(
        "PAYMENT FAILED"
      );



      const { data, error } = await supabase

        .from("Orders")

        .update({

          paymentStatus:
          "Payment Failed",


          payment_status_reason:
          resultDescription

        })

        .eq(
          "checkout_request_id",
          checkoutRequestId
        )

        .select();



      console.log(
        "FAILED PAYMENT UPDATE RESULT:",
        data
      );


      console.log(
        "FAILED PAYMENT UPDATE ERROR:",
        error
      );


    }



    return res.status(200).json({

      ResultCode: 0,

      ResultDesc: "Accepted"

    });



  } catch(error){


    console.error(
      "CALLBACK ERROR:",
      error
    );


    return res.status(200).json({

      ResultCode: 0,

      ResultDesc: "Accepted"

    });

  }

}