package com.medair;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;

public class SignupActivity extends AppCompatActivity {

    private Button signUpButton;

    private EditText unIDEditText;
    private EditText addressEditText;
    private EditText phoneNumberEditText;
    private EditText dobEditText;
    private EditText disabilityEditText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        signUpButton = (Button) findViewById(R.id.sign_up_button);

        unIDEditText = (EditText) findViewById(R.id.unid_edit_text);
        addressEditText = (EditText) findViewById(R.id.address_edit_text);
        phoneNumberEditText = (EditText) findViewById(R.id.phone_number_edit_text);
        dobEditText = (EditText) findViewById(R.id.dob_edit_text);
        disabilityEditText = (EditText) findViewById(R.id.disability_edit_text);
    }
}
