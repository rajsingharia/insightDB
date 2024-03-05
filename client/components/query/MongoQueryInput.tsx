
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@radix-ui/react-select';
import { ReloadIcon } from '@radix-ui/react-icons';
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { useTheme } from 'next-themes';

type QueryInputProps = {
  rawQuery: string,
  setRawQuery: React.Dispatch<React.SetStateAction<string>>,
  getInsightData: () => void,
  loading: boolean | undefined
}


export const MongoQueryInput: React.FC<QueryInputProps> = ({
  rawQuery,
  setRawQuery,
  getInsightData,
  loading
}) => {

  useEffect(() => {
    const sampleJSON = `{
            "collection": "yourCollectionName",
            "pipeline": [
              {
                "$match": {
                  "field1": "value1",
                  "field2": { "$gte": 10 }
                }
              },
              {
                "$project": {
                  "_id": "0",
                  "newField2": 1
                }
              },
              {
                "$group": {
                  "_id": "$groupField",
                  "total": { "$sum": "$numericField" }
                }
              },
              {
                "$sort": {
                  "total": -1
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
    <div className="flex flex-col gap-2 w-full h-full">
      {/* <Input
                value={collection}
                onChange={(event) => setCollection(event.target.value)}
                placeholder='Collection Name' />

            <p className="text-sm text-muted-foreground">{"example: name=john&age>21&fields=name,age&sort=name,-age&offset=10&limit=10"}</p>

            <Input
                id='mongoDBQuery'
                value={mongoRawQuery}
                onChange={(event) => setMongoRawQuery(event.target.value)}
                placeholder='MongoDB Query' /> */}
      <AceEditor
        aria-label="editor"
        mode="javascript"
        theme={theme === "dark" ? "monokai" : "github"}
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
      <Button
        onClick={getInsightData}>
        {
          loading &&
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        }
        {
          loading ? "Fetching Data..." : "Get Data"
        }
      </Button>
    </div>
  )
}
