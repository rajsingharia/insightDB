
import React, { useEffect, useState } from 'react'
import { CustomAceEditor } from '../aceEditor/CustomAceEditor';
var beautify = require("json-beautify");

type QueryInputProps = {
  rawQuery: string | undefined,
  setRawQuery: React.Dispatch<React.SetStateAction<string | undefined>>,
}


export const RedisQueryInput: React.FC<QueryInputProps> = ({
  rawQuery,
  setRawQuery
}) => {

  useEffect(() => {
    const redisJSON = {
      dataType: "DATA_TYPE",
      key: "KEY"
    }
    if (!rawQuery) {
      setRawQuery(beautify(redisJSON, null, 2, 80))
    }
  }, [])



  return (
    <div className="w-full h-full">
      <CustomAceEditor
        data={rawQuery}
        setData={setRawQuery}
      />
    </div>
  )
}
