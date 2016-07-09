package com.medair;

import android.location.Location;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.google.android.gms.location.LocationListener;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;

public class HomeActivity extends AppCompatActivity implements LocationListener, GoogleMap.OnMyLocationChangeListener{

    private GoogleMap mMap; // Might be null if Google Play services APK is not available.

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
    }

    private void setUpMapIfNeeded() {
        // Do a null check to confirm that we have not already instantiated the map.
        if (mMap == null) {
            // Try to obtain the map from the SupportMapFragment.
            mMap = ((SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map))
                    .getMap();
            mMap.setMyLocationEnabled(true);
            mMap.setOnMyLocationChangeListener(this);

        }
    }

    @Override
    public void onLocationChanged(Location location) {

    }

    @Override
    public void onMyLocationChange(Location location) {
            CameraUpdate myLoc = CameraUpdateFactory.newCameraPosition(
                    new CameraPosition.Builder().target(new LatLng(location.getLatitude(),
                            location.getLongitude())).zoom(15).build());
            mMap.animateCamera(myLoc);
            mMap.setOnMyLocationChangeListener(null);
    }
}
