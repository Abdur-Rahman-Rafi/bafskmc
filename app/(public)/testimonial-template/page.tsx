"use client";

import { Printer } from "lucide-react";

export default function TestimonialTemplate() {
    return (
        <div className="bg-white min-h-screen pt-20 pb-20 text-black font-sans">
            <div className="max-w-3xl mx-auto px-8">
                <div className="flex justify-end mb-8 print:hidden">
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                        <Printer className="h-5 w-5" />
                        <span>Print Document</span>
                    </button>
                </div>

                <div className="border-[12px] border-double border-gray-800 p-12 bg-white relative">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-black uppercase tracking-widest text-gray-900 mb-2">BAFSK Math Club</h1>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">Official Testimonial Template</p>
                        <div className="w-24 h-1 bg-gray-900 mx-auto mt-6" />
                    </div>

                    <div className="space-y-8 text-lg leading-relaxed text-gray-800">
                        <p className="font-semibold text-right mb-12">Date: ____ / ____ / 20___</p>

                        <p>
                            To Whom It May Concern,
                        </p>

                        <p className="text-justify">
                            This is to certify that <span className="inline-block w-64 border-b border-dashed border-gray-500"></span>, 
                            a student of Class <span className="inline-block w-24 border-b border-dashed border-gray-500"></span>, 
                            Section <span className="inline-block w-24 border-b border-dashed border-gray-500"></span>, 
                            is an applicant for the <strong>BAFSK Math Club Executive Panel</strong>. 
                        </p>

                        <p className="text-justify">
                            I have observed their activities and confirm that they demonstrate the required dedication, 
                            leadership qualities, and discipline expected of a club panel member. Their conduct is highly 
                            satisfactory, and I recommend them for the aforementioned position.
                        </p>

                        <div className="mt-20 flex justify-between items-end">
                            <div className="text-center">
                                <div className="w-64 border-b border-gray-800 mb-2" />
                                <p className="font-bold text-gray-900">Student Signature</p>
                            </div>
                            <div className="text-center">
                                <div className="w-64 border-b border-gray-800 mb-2" />
                                <p className="font-bold text-gray-900">Moderator Signature</p>
                                <p className="text-sm text-gray-600 mt-1">Name & Seal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
