package com.medair;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.medair.utils.LocalSettings;

import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {

    private Button signInButton;
    private Button signUpButton;

    private EditText unIdEditText;
    private EditText passwordEditText;

    private ProgressDialog mProgressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        signInButton = (Button) findViewById(R.id.sign_in_button);
        signUpButton = (Button) findViewById(R.id.sign_up_button);

        unIdEditText = (EditText) findViewById(R.id.unid_edit_text);
        passwordEditText = (EditText) findViewById(R.id.password_edit_text);

        setTitle("Sign In");

        mProgressDialog = new ProgressDialog(this);
        mProgressDialog.setCancelable(false);
        mProgressDialog.setMessage("Processing...");

        setupSignUpButton();
        setupSignInButton();
    }

    private void setupSignUpButton()
    {
        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, SignupActivity.class);
                startActivity(intent);
            }
        });
    }

    private void setupSignInButton()
    {
        signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                mProgressDialog.show();
//                new SignIn().execute();

                LocalSettings.setUserID(LoginActivity.this, unIdEditText.getText().toString());

                Intent intent = new Intent(LoginActivity.this, ServicesNeededActivity.class);
                startActivity(intent);
            }
        });
    }

    private class SignIn extends AsyncTask<Void, Void, Void>
    {
        JSONObject parameters = new JSONObject();

        @Override
        protected void onPreExecute() {
            super.onPreExecute();

            try {

                parameters.put("uid", unIdEditText.getText().toString());
                parameters.put("password", passwordEditText.getText().toString());

            }catch (Exception e)
            {
                e.printStackTrace();

            }
        }

        @Override
        protected Void doInBackground(Void... params) {

            RequestQueue queue = Volley.newRequestQueue(LoginActivity.this);

            JsonObjectRequest request = new JsonObjectRequest("https://9e87046f.ngrok.io/login", parameters, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    try {
                        mProgressDialog.hide();

                        LocalSettings.setUserID(LoginActivity.this, unIdEditText.getText().toString());

                        if(response.getString("statusCode").equals("200"))
                        {
                            Intent intent = new Intent(LoginActivity.this, ServicesNeededActivity.class);
                            startActivity(intent);
                        }
                        else {
                            Toast.makeText(LoginActivity.this, "Oops there was a problem. Please try again.", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    mProgressDialog.hide();
                    Toast.makeText(LoginActivity.this, error.getMessage(), Toast.LENGTH_SHORT).show();
                    System.err.println("error "+error.getMessage());
                }
            });

            queue.add(request);

            return null;
        }
    }
}
