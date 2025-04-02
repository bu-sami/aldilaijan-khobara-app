import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Aldilaijan & Khobara Admin Panel</title>
        <meta name="description" content="Admin panel for Aldilaijan and Khobara" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        direction: 'rtl'
      }}>
        <h1>مرحبًا بك في لوحة إدارة الدليجان والخبرة</h1>
        <p>هذه النسخة التجريبية من لوحة الإدارة المشتركة</p>
      </main>
    </div>
  );
}
