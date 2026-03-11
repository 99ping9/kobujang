import React, { useState, useEffect } from 'react'
import { X, Send, Calendar as CalendarIcon, CheckCircle, Square, CheckSquare } from 'lucide-react'
import { format } from 'date-fns'
import { SubmissionType, SUBMISSION_TYPES } from '@/types'

interface SubmissionModalProps {
    isOpen: boolean
    onClose: () => void
    date: Date
    onSubmit: (data: { types: SubmissionType[] }) => Promise<void>
    submittedTypes: SubmissionType[]
    defaultType?: SubmissionType
    isAdminViewing?: boolean
}

const SubmissionModal = ({ isOpen, onClose, date, onSubmit, submittedTypes, defaultType, isAdminViewing = false }: SubmissionModalProps) => {
    const [selectedTypes, setSelectedTypes] = useState<SubmissionType[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setSelectedTypes(defaultType && !submittedTypes.includes(defaultType) ? [defaultType] : [])
            setIsSubmitting(false)
        }
    }, [isOpen, defaultType, submittedTypes])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newTypes = selectedTypes.filter(t => !submittedTypes.includes(t))
        if (newTypes.length === 0) {
            onClose()
            return
        }

        setIsSubmitting(true)
        await onSubmit({ types: newTypes })
        setIsSubmitting(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-500" />
                        {isAdminViewing ? '기록 보기' : '기록하기'} <span className="text-slate-400 text-sm font-normal">| {format(date, 'MM.dd')}</span>
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-3">
                            {SUBMISSION_TYPES.map(type => {
                                const isDone = submittedTypes.includes(type.id)
                                const isSelected = selectedTypes.includes(type.id)

                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            if (isDone || isAdminViewing) return
                                            setSelectedTypes(prev =>
                                                prev.includes(type.id)
                                                    ? prev.filter(t => t !== type.id)
                                                    : [...prev, type.id]
                                            )
                                        }}
                                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${isDone
                                            ? 'bg-slate-50 border-slate-200 cursor-default opacity-70'
                                            : isSelected
                                                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md ring-2 ring-blue-500/20'
                                                : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
                                            }`}
                                        disabled={isDone || isAdminViewing}
                                    >
                                        {isDone ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : isSelected ? (
                                            <CheckSquare className="w-6 h-6 text-blue-500" />
                                        ) : (
                                            <Square className="w-6 h-6 text-slate-400" />
                                        )}
                                        <div className="flex-1 text-left">
                                            <span className="font-bold">{type.label}</span>
                                        </div>
                                        {isDone && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">완료됨</span>}
                                    </button>
                                )
                            })}
                        </div>

                        {!isAdminViewing && (
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || selectedTypes.filter(t => !submittedTypes.includes(t)).length === 0}
                                    className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? '저장 중...' : '선택 항목 제출하기'} <Send className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SubmissionModal
