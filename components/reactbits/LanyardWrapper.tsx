'use client';
import dynamic from 'next/dynamic';

const Lanyard = dynamic(() => import('@/components/reactbits/Lanyard'), { ssr: false });

export default function LanyardWrapper(props: any) {
  return <Lanyard {...props} />;
}
