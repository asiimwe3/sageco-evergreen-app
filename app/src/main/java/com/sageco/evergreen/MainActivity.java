package com.sageco.evergreen;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

public class MainActivity extends Activity {

    private WebView webView;
    private LinearLayout splashScreen;
    private LinearLayout offlineScreen;
    private static final String APP_URL = "https://sageco-evergreen.vercel.app/?app=true";
    private static final String APP_BASE = "https://sageco-evergreen.vercel.app";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        splashScreen  = findViewById(R.id.splash_screen);
        offlineScreen = findViewById(R.id.offline_screen);
        webView       = findViewById(R.id.webview);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setSupportZoom(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);

        // ── App Mode: inject custom User-Agent ──
        // Next.js middleware detects "SagecoApp" and activates App Mode
        String defaultUA = settings.getUserAgentString();
        settings.setUserAgentString(defaultUA + " SagecoApp/1.0");

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                splashScreen.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode,
                                        String description, String failingUrl) {
                splashScreen.setVisibility(View.GONE);
                webView.setVisibility(View.GONE);
                offlineScreen.setVisibility(View.VISIBLE);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                String url = req.getUrl().toString();
                // Keep all sageco pages inside the WebView
                if (url.startsWith(APP_BASE)) {
                    return false;
                }
                // External links open in browser
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                return true;
            }
        });

        splashScreen.setVisibility(View.VISIBLE);
        webView.setVisibility(View.GONE);
        offlineScreen.setVisibility(View.GONE);

        if (isOnline()) {
            webView.loadUrl(APP_URL);
        } else {
            splashScreen.setVisibility(View.GONE);
            offlineScreen.setVisibility(View.VISIBLE);
        }

        findViewById(R.id.btn_retry).setOnClickListener(v -> {
            if (isOnline()) {
                offlineScreen.setVisibility(View.GONE);
                splashScreen.setVisibility(View.VISIBLE);
                webView.loadUrl(APP_URL);
            }
        });
    }

    private boolean isOnline() {
        ConnectivityManager cm =
            (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        NetworkInfo info = cm.getActiveNetworkInfo();
        return info != null && info.isConnected();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
