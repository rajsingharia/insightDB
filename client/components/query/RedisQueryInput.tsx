
import React, { useEffect, useState } from 'react'
import { CustomAceEditor } from '../aceEditor/CustomAceEditor';

type QueryInputProps = {
  rawQuery: string,
  setRawQuery: React.Dispatch<React.SetStateAction<string>>,
}


export const RedisQueryInput: React.FC<QueryInputProps> = ({
  rawQuery,
  setRawQuery
}) => {

  useEffect(() => {
    const sampleJSON = `{\n\t"dataType": "DATA_TYPE",\n\t"key": "KEY"\n}`
    if (!rawQuery) {
      setRawQuery(sampleJSON)
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
