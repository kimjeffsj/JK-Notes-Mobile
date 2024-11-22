import React from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ScrollView } from "react-native";
import WebView from "react-native-webview";

interface NoteViewerProps {
  content: string;
}

const NoteViewer: React.FC<NoteViewerProps> = ({ content }) => {
  const { isDark } = useTheme();

  const htmlContent = `
  <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          body {
            font-family: -apple-system, system-ui;
            font-size: 16px;
            line-height: 1.5;
            color: ${isDark ? "#ffffff" : "#1a1a1a"};
            background-color: ${isDark ? "#1a1a1a" : "#f8f7f2"};
            padding: 12px;
            margin: 0;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          a {
            color: #dfa46d;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
`;

  return (
    <ScrollView className="flex-1">
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        scrollEnabled={false}
        className="flex-1 bg-transparent"
        onShouldStartLoadWithRequest={() => true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        automaticallyAdjustContentInsets={true}
        injectedJavaScript={`window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)`}
      />
    </ScrollView>
  );
};

export default NoteViewer;
