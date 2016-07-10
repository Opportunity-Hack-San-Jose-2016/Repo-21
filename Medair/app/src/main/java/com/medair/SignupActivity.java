package com.medair;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.location.Location;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.appdatasearch.GetRecentContextCall;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class SignupActivity extends AppCompatActivity implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener{

    private Button signUpButton;

    private EditText unIDEditText;
    private EditText emailEditText;
    private EditText passwordEditText;
    private EditText confirmPasswordEditText;
    private EditText firstNameEditText;
    private EditText lastNameEditText;
    private EditText phoneNumberEditText;
    private EditText disabilityEditText;
    private EditText dobEditText;

    private Spinner genderSpinner;

    private GoogleApiClient mGoogleApiClient;

    private Location mLastLocation;

    private ProgressDialog mProgressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        signUpButton = (Button) findViewById(R.id.sign_up_button);

        unIDEditText = (EditText) findViewById(R.id.unid_edit_text);
        emailEditText = (EditText) findViewById(R.id.email_edit_text);
        passwordEditText = (EditText) findViewById(R.id.password_edit_text);
        confirmPasswordEditText = (EditText) findViewById(R.id.confirm_password_edit_text);
        firstNameEditText = (EditText) findViewById(R.id.first_name_edit_text);
        lastNameEditText = (EditText) findViewById(R.id.last_name_edit_text);
        phoneNumberEditText = (EditText) findViewById(R.id.phone_number_edit_text);
        dobEditText = (EditText) findViewById(R.id.dob_edit_text);
        disabilityEditText = (EditText) findViewById(R.id.disability_edit_text);

        genderSpinner = (Spinner) findViewById(R.id.gender_spinner);

        setTitle("Sign Up");

        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(this)
                    .addConnectionCallbacks(this)
                    .addOnConnectionFailedListener(this)
                    .addApi(LocationServices.API)
                    .build();
        }

        mProgressDialog = new ProgressDialog(this);
        mProgressDialog.setCancelable(false);
        mProgressDialog.setMessage("Processing...");

        setupSignUpButton();
        // 192.168.83.124:3001
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

    private void setupSignUpButton()
    {
        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mProgressDialog.show();
                new SignUp().execute();
            }
        });
    }

    private class SignUp extends AsyncTask<Void, Void, Void>
    {
        JSONObject parameters = new JSONObject();

        @Override
        protected void onPreExecute() {
            super.onPreExecute();

            try {

                parameters.put("un_id", unIDEditText.getText().toString());
                parameters.put("firstName", firstNameEditText.getText().toString());
                parameters.put("lastName", lastNameEditText.getText().toString());
                parameters.put("email", emailEditText.getText().toString());
                parameters.put("phoneNumber", phoneNumberEditText.getText().toString());
                parameters.put("password", passwordEditText.getText().toString());
                parameters.put("cnfPassword", passwordEditText.getText().toString());
                parameters.put("dob", dobEditText.getText().toString());
                parameters.put("gender", genderSpinner.getSelectedItem());
                parameters.put("disability", disabilityEditText.getText().toString());

                JSONObject locationJson = new JSONObject();

                locationJson.put("lat", String.valueOf(mLastLocation.getLatitude()));
                locationJson.put("long", String.valueOf(mLastLocation.getLatitude()));

                parameters.put("location", locationJson.toString());

            }catch (Exception e)
            {
                e.printStackTrace();

            }
        }

        @Override
        protected Void doInBackground(Void... params) {

            RequestQueue queue = Volley.newRequestQueue(SignupActivity.this);

            JsonObjectRequest request = new JsonObjectRequest("https://9e87046f.ngrok.io/register", parameters, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    try {
                        mProgressDialog.hide();
                        if(response.getString("statusCode").equals("200"))
                        {
                            Toast.makeText(SignupActivity.this, "Registered successfully", Toast.LENGTH_SHORT).show();
                        }
                        else {
                            Toast.makeText(SignupActivity.this, "Oops there was a problem. Please try again.", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    mProgressDialog.hide();
                    Toast.makeText(SignupActivity.this, error.getMessage(), Toast.LENGTH_SHORT).show();
                    System.err.println("error "+error.getMessage());
                }
            });

            queue.add(request);

            return null;
        }
    }
}
