'use client'

import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(async() => (await import('editorjs-react-renderer')).default,{
    ssr: false
})

type Props = {
  content: any
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem'
    }
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
}

const EditorOutput = ({content}: Props) => {
  return (
    // @ts-expect-error
    <Output 
        className="text-sm" 
        style={style}
        data={content}
        renderers={renderers} />
    )
}

function CustomCodeRenderer({data}: any) {
    return (
        <pre className="bg-gray-800 rounded-md p-4">
            <code className="tex-gray-100 text-sm">{data.code}</code>
        </pre>
    )
}

function CustomImageRenderer({data}: any) {
    const src = data.file.url 
    return (
        <div className="relative w-full min-h-[15rem]">
            <Image alt="image" className="object-contain" fill src={src} />
        </div>
    )
}

export default EditorOutput;