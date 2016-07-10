package com.medair;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.location.Location;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.provider.Telephony;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.medair.utils.LocalSettings;
import com.medair.utils.Utils;

import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;

public class ServicesNeededActivity extends AppCompatActivity implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {

    private Button helpButton;

    private TextView cashAssistanceTextView;
    private TextView medicareTextView;
    private TextView waterTextView;
    private TextView foodTextView;
    private TextView housingTextView;
    private TextView vaccinationTextView;

    private CheckBox cashAssistanceCheckbox;
    private CheckBox medicareCheckBox;
    private CheckBox waterCheckBox;
    private CheckBox foodCheckBox;
    private CheckBox housingCheckBox;
    private CheckBox vaccinationCheckBox;

    private AlertDialog messageDialog;

    private GoogleApiClient mGoogleApiClient;

    private Location mLastLocation;

    private ProgressDialog mProgressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_services_needed);

        helpButton = (Button) findViewById(R.id.help_button);

        cashAssistanceTextView = (TextView) findViewById(R.id.cash_assistance_textview);
        medicareTextView = (TextView) findViewById(R.id.medicare_textview);
        waterTextView = (TextView) findViewById(R.id.water_textview);
        foodTextView = (TextView) findViewById(R.id.food_textview);
        housingTextView = (TextView) findViewById(R.id.housing_textview);
        vaccinationTextView = (TextView) findViewById(R.id.vaccination_textview);

        cashAssistanceCheckbox = (CheckBox) findViewById(R.id.cash_assistance_checkbox);
        medicareCheckBox = (CheckBox) findViewById(R.id.medicare_checkbox);
        waterCheckBox = (CheckBox) findViewById(R.id.water_checkbox);
        foodCheckBox = (CheckBox) findViewById(R.id.food_checkbox);
        housingCheckBox = (CheckBox) findViewById(R.id.housing_checkbox);
        vaccinationCheckBox = (CheckBox) findViewById(R.id.vaccination_checkbox);

        setUpCashAssistanceTextView();
        setUpFoodTextView();
        setUpHousingTextView();
        setUpMedicareTextView();
        setUpVaccinationTextView();
        setUpWaterTextView();

        setUpHelpButton();

        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(this)
                    .addConnectionCallbacks(this)
                    .addOnConnectionFailedListener(this)
                    .addApi(LocationServices.API)
                    .build();
        }

        mProgressDialog = new ProgressDialog(this);
        mProgressDialog.setCancelable(false);
        mProgressDialog.setMessage("Requesting...");
    }

    protected void onStart() {
        mGoogleApiClient.connect();
        super.onStart();
    }

    protected void onStop() {
        mGoogleApiClient.disconnect();
        super.onStop();
    }

    @Override
    public void onConnected(Bundle bundle) {
        mLastLocation = LocationServices.FusedLocationApi.getLastLocation(
                mGoogleApiClient);
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

    }

    private void setUpCashAssistanceTextView()
    {
        cashAssistanceTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cashAssistanceCheckbox.setChecked(!cashAssistanceCheckbox.isChecked());
            }
        });
    }

    private void setUpMedicareTextView()
    {
        medicareTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                medicareCheckBox.setChecked(!medicareCheckBox.isChecked());
            }
        });
    }

    private void setUpWaterTextView()
    {
        waterTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                waterCheckBox.setChecked(!waterCheckBox.isChecked());
            }
        });
    }

    private void setUpFoodTextView()
    {
        foodTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                foodCheckBox.setChecked(!foodCheckBox.isChecked());
            }
        });
    }

    private void setUpHousingTextView()
    {
        housingTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                housingCheckBox.setChecked(!housingCheckBox.isChecked());
            }
        });
    }

    private void setUpVaccinationTextView()
    {
        vaccinationTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                vaccinationCheckBox.setChecked(!vaccinationCheckBox.isChecked());
            }
        });
    }

    private void setUpHelpButton()
    {
       helpButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               AlertDialog.Builder builder = new AlertDialog.Builder(ServicesNeededActivity.this);

               LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
               View customView = inflater.inflate(R.layout.message_dialog, null);

               builder.setView(customView);

               final EditText messageEditText = (EditText) customView.findViewById(R.id.message_edittext);

               Button sendButton = (Button) customView.findViewById(R.id.send_button);
               sendButton.setOnClickListener(new View.OnClickListener() {
                   @Override
                   public void onClick(View v) {

                       StringBuilder textMessageBuilder = new StringBuilder();

                       textMessageBuilder.append("I need help with");

                       if(cashAssistanceCheckbox.isChecked())
                           textMessageBuilder.append(" cash assistance, ");

                       if(medicareCheckBox.isChecked())
                           textMessageBuilder.append("medicare, ");

                       if(foodCheckBox.isChecked())
                           textMessageBuilder.append("food, ");

                       if(waterCheckBox.isChecked())
                           textMessageBuilder.append("water, ");

                       if(housingCheckBox.isChecked())
                           textMessageBuilder.append("housing, ");

                       if(vaccinationCheckBox.isChecked())
                           textMessageBuilder.append("vaccination");

                       textMessageBuilder.append(" " + messageEditText.getText().toString());

                       if(Utils.isOnline(ServicesNeededActivity.this))
                       {
                           mProgressDialog.show();
                           new RequestHelp(textMessageBuilder.toString()).execute();
                       }
                       else
                       {
                           sendSMS(textMessageBuilder.toString());
                       }

                       messageDialog.dismiss();
                   }
               });

               messageDialog = builder.create();
               messageDialog.show();
           }
       });
    }

    private void sendSMS(String textMessage) {

        StringBuilder stringBuilder = new StringBuilder(textMessage);
        stringBuilder.append(";");
        stringBuilder.append(LocalSettings.getUserID(ServicesNeededActivity.this));
        stringBuilder.append(";");
        stringBuilder.append(mLastLocation.getLatitude());
        stringBuilder.append(";");
        stringBuilder.append(mLastLocation.getLongitude());

        textMessage = stringBuilder.toString();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) // At least KitKat
        {
            String defaultSmsPackageName = Telephony.Sms.getDefaultSmsPackage(this); // Need to change the build to API 19

            Intent sendIntent = new Intent(Intent.ACTION_SENDTO);
            sendIntent.setType("text/plain");
            sendIntent.setData(Uri.parse("sms:+13347210102"));
//            sendIntent.putExtra(Intent.EXTRA_TEXT, textMessage);
            sendIntent.putExtra("sms_body",textMessage);

            if (defaultSmsPackageName != null)// Can be null in case that there is no default, then the user would be able to choose
            // any app that support this intent.
            {
                sendIntent.setPackage(defaultSmsPackageName);
            }
            startActivity(sendIntent);

        }
        else // For early versions, do what worked for you before.
        {
            Intent smsIntent = new Intent(android.content.Intent.ACTION_VIEW);
            smsIntent.setType("vnd.android-dir/mms-sms");
//            smsIntent.putExtra("address", "phoneNumber");
            smsIntent.setData(Uri.parse("sms:+13347210102"));
            smsIntent.putExtra("sms_body",textMessage);
            startActivity(smsIntent);
        }
    }

    private class RequestHelp extends AsyncTask<Void, Void, Void>
    {
        private JSONObject parameters = new JSONObject();

        private String message;

        public RequestHelp(String message)
        {
            this.message = message;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();

            try {

//                        'firstName' : req.param('firstName'),
//                        'lastName' : req.param('lastName'),
//                        'services' : req.param('services'),
//                        'phoneNumber' : req.param('phoneNumber'),

                parameters.put("uid", LocalSettings.getUserID(ServicesNeededActivity.this));
                parameters.put("orgId", "1");
                parameters.put("organization", "Medair");
                parameters.put("firstName","Apoorv");
                parameters.put("phoneNumber", "6692478678");
                parameters.put("lastName","Patel");
                parameters.put("message", message);

                JSONArray services = new JSONArray();

                if(cashAssistanceCheckbox.isChecked())
                    services.put("Healthcare");

                if(medicareCheckBox.isChecked())
                    services.put("Medicare");

                if(foodCheckBox.isChecked())
                    services.put("Food");

                if(waterCheckBox.isChecked())
                    services.put("Water");

                if(housingCheckBox.isChecked())
                    services.put("Housing");

                if(vaccinationCheckBox.isChecked())
                    services.put("Vaccination");

                JSONObject locationJson = new JSONObject();

                locationJson.put("lat", String.valueOf(mLastLocation.getLatitude()));
                locationJson.put("long", String.valueOf(mLastLocation.getLongitude()));

                parameters.put("services", services);
                parameters.put("location", locationJson);

            }catch (Exception e)
            {
                e.printStackTrace();

            }
        }

        @Override
        protected Void doInBackground(Void... params) {

            RequestQueue queue = Volley.newRequestQueue(ServicesNeededActivity.this);

            JsonObjectRequest request = new JsonObjectRequest("http://8d970d9c.ngrok.io/requestHelp", parameters, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    try {
                        mProgressDialog.hide();
                        System.err.println("response " + response);

                        if(response.getString("statusCode").equals("200"))
                        {
                            AlertDialog.Builder builder = new AlertDialog.Builder(ServicesNeededActivity.this);

                            LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);

                            View view = inflater.inflate(R.layout.request_sent_dialog, null);

                            builder.setView(view);

                            builder.setPositiveButton("OK", null);

                            builder.create().show();
                        }
                        else {
                            Toast.makeText(ServicesNeededActivity.this, "Oops there was a problem. Please try again.", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    mProgressDialog.hide();
//                    Toast.makeText(ServicesNeededActivity.this, error.getMessage(), Toast.LENGTH_SHORT).show();
                    System.err.println("error "+error.getMessage());
                }
            });

            queue.add(request);

            return null;
        }
    }
}
