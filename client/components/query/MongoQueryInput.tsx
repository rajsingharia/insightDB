
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
  // getInsightData: () => void,
  // loading: boolean | undefined
}


export const MongoQueryInput: React.FC<QueryInputProps> = ({
  rawQuery,
  setRawQuery,
  // getInsightData,
  // loading
}) => {

  useEffect(() => {
    const sampleJSON = `{
            "collection": "COLLECTION_NAME",
            "pipeline": [
              {
                "$match": {
                  "FIELD_1": "VALUE",
                  "FIELD_2": { "$gte": 10 }
                }
              },
              {
                "$project": {
                  "_id": "0",
                  "FIELD": 1
                }
              },
              {
                "$group": {
                  "_id": "$groupField",
                  "SUM_FIELD": { "$sum": "$FIELD" }
                }
              },
              {
                "$sort": {
                  "FIELD": -1
                }
              },
              {
                "$limit": 10
              }
            ]
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
      {/* <Button
        onClick={getInsightData}>
        {
          loading &&
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        }
        {
          loading ? "Fetching Data..." : "Get Data"
        }
      </Button> */}
    </div>
  )
}
