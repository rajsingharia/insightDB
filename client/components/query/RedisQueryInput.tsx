
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@radix-ui/react-select';
import { ReloadIcon } from '@radix-ui/react-icons';
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { useTheme } from 'next-themes';

type QueryInputProps = {
  rawQuery: string,
  setRawQuery: React.Dispatch<React.SetStateAction<string>>,
}


export const RedisQueryInput: React.FC<QueryInputProps> = ({
  rawQuery,
  setRawQuery
}) => {

  useEffect(() => {
    const sampleJSON = `{
            "dataType": "DATA_TYPE",
            "key": "KEY"
          }`
    if (!rawQuery) {
      setRawQuery(sampleJSON)
    }
  }, [])


  const { theme } = useTheme()



  return (
    <div className="w-full h-full">
      <AceEditor
        aria-label="editor"
        mode="json"
        theme={theme === "dark" ? "terminal" : "github"}
        name="editor"
        width="100%"
        fontSize={12}
        minLines={13}
        maxLines={18}
        showPrintMargin={false}
        showGutter
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true
        }}
        value={rawQuery}
        onChange={(value) => setRawQuery(value)}
      />
    </div>
  )
}
