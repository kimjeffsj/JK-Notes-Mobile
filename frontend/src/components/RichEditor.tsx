import React, { useRef, useEffect } from "react";
import { View, Text } from "react-native";
import {
  RichEditor as NativeRichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { useTheme } from "@/shared/hooks/useTheme";

interface RichTextEditorProps {
  initialContent?: string;
  onChangeContent: (text: string) => void;
  placeholder?: string;
  editorHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = "",
  onChangeContent,
  placeholder = "Start writing here...",
  editorHeight = 300,
}) => {
  const richText = useRef<NativeRichEditor>(null);
  const { isDark } = useTheme();

  const getEditor = () => richText.current;

  // cleanup 함수
  useEffect(() => {
    return () => {
      if (richText.current) {
        // @ts-ignore
        richText.current?.setContentHTML("");
      }
    };
  }, []);

  return (
    <View style={{ flex: 1, minHeight: editorHeight }}>
      <RichToolbar
        editor={richText}
        getEditor={getEditor}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.heading1,
          actions.heading2,
          "separator",
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          "separator",
          actions.keyboard,
          actions.setParagraph,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          "separator",
          actions.undo,
          actions.redo,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text
              style={{ color: tintColor, fontSize: 16, fontWeight: "bold" }}
            >
              H1
            </Text>
          ),
          [actions.heading2]: ({ tintColor }) => (
            <Text
              style={{ color: tintColor, fontSize: 16, fontWeight: "bold" }}
            >
              H2
            </Text>
          ),
        }}
        selectedIconTint="#dfa46d"
        iconTint={isDark ? "#ffffff" : "#1a1a1a"}
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#f8f7f2",
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#2a2a2a" : "#e2e2e2",
        }}
      />

      <NativeRichEditor
        ref={richText}
        onChange={onChangeContent}
        placeholder={placeholder}
        initialContentHTML={initialContent}
        useContainer={true}
        initialHeight={editorHeight}
        style={{
          flex: 1,
          backgroundColor: isDark ? "#1a1a1a" : "#f8f7f2",
        }}
        containerStyle={{
          flex: 1,
        }}
        editorStyle={{
          backgroundColor: isDark ? "#1a1a1a" : "#f8f7f2",
          color: isDark ? "#ffffff" : "#1a1a1a",
          placeholderColor: isDark ? "#666666" : "#999999",
          contentCSSText: `
            font-family: -apple-system, system-ui;
            font-size: 16px;
            padding: 12px;
            min-height: ${editorHeight}px;
          `,
        }}
      />
    </View>
  );
};

export default RichTextEditor;
