import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { useTheme } from 'next-themes';

type AceEditorProps = {
  data: any,
  setData: React.Dispatch<React.SetStateAction<any>>,
}


export const CustomAceEditor: React.FC<AceEditorProps> = ({
  data,
  setData
}) => {

  const { theme } = useTheme()



  return (
    <AceEditor
      aria-label="editor"
      mode="json"
      theme={theme === "dark" ? "chaos" : "github"}
      name="editor"
      width="100%"
      height="100%"
      showPrintMargin={false}
      showGutter
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true
      }}
      value={data}
      onChange={(value) => setData(value)}
    />
  )
}
