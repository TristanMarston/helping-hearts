import { AnimatePresence, motion } from 'motion/react';

import { ContactFormData } from './Footer';
import { X } from 'lucide-react';

const ConfirmMessageModal = ({
    open,
    setOpen,
    formData,
    handleSubmit,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formData: ContactFormData;
    handleSubmit: () => void;
}) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className='bg-slate-900/20 overflow-hidden backdrop-blur p-2 mid-mobile:p-4 mid-phone:p-6 fixed inset-0 z-[100] grid place-items-center overflow-y-scroll cursor-pointer'
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: '12.5deg' }}
                            animate={{ scale: 1, rotate: '0deg' }}
                            exit={{ scale: 0, rotate: '0deg' }}
                            onClick={(e) => e.stopPropagation()}
                            className='bg-background rounded-xl overflow-x-hidden gap-2.5 border-4 border-primary text-white p-5 mid-phone:p-6 w-full max-w-3xl shadow-xl cursor-default relative overflow-hidden'
                        >
                            <X className='absolute right-7 top-7 cursor-pointer text-primary' onClick={() => setOpen(false)} />
                            <h2 className={`font-fredoka font-semibold text-2xl mid-mobile:text-3xl mid-phone:text-4xl text-primary`}>Ready to submit?</h2>
                            <section className='flex flex-col items-start text-left w-full gap-2'>
                                <p className={`font-fredoka font-medium text-primary opacity-60 text-xs mid-mobile:text-sm mid-phone:text-base`}>
                                    Please confirm your message. Our team will try our best to respond via email within 24 hours.
                                </p>
                                <div className='w-full px-0 mid-mobile:px-2 mid-phone:px-4 space-y-1'>
                                    {['name', 'email', 'subject', 'message'].map((key) => (
                                        <div className={`font-fredoka font-normal flex flex-col gap-1.5 items-center w-full`} key={key}>
                                            <label className='flex justify-start w-full text-sm mid-mobile:text-base mid-phone:text-lg text-primary'>
                                                {key
                                                    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
                                                    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
                                                    .toLowerCase()}
                                            </label>

                                            {key === 'message' ? (
                                                <textarea
                                                    rows={1}
                                                    disabled
                                                    value={formData[key as keyof typeof formData]}
                                                    className={`${
                                                        formData[key as keyof typeof formData].length > 0 ? 'border-gray-100' : 'border-red-500'
                                                    } text-primary text-sm mid-phone:text-base hide-scrollbar mid-phone:px-3 mid-phone:py-1.5 opacity-60 hover:cursor-not-allowed rounded-[10px] text-ellipsis overflow-y-scroll bg-background min-h-[4.25rem] max-h-32 h-full w-full py-2 px-2.5 border-gray-100 border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                                    style={{ lineHeight: 'normal' }}
                                                ></textarea>
                                            ) : (
                                                <input
                                                    disabled
                                                    type='text'
                                                    value={key === 'name' ? `${formData.firstName} ${formData.lastName}` : formData[key as keyof typeof formData]}
                                                    className={`${
                                                        key === 'email' && !/\S+@\S+\.\S+/.test(formData[key as keyof typeof formData]) ? 'border-red-500' : 'border-gray-100'
                                                    } text-primary text-sm mid-phone:text-base mid-phone:px-3 mid-phone:py-1.5 opacity-60 bg-background w-full rounded-[10px] px-2.5 py-1 border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <div className='flex gap-2 mid-phone:gap-2.5 mt-4'>
                                <button
                                    onClick={() => setOpen(false)}
                                    className={`font-fredoka cursor-pointer font-semibold bg-transparent hover:bg-background-secondary transition-all text-primary-light w-full p-1 text-base mid-phone:p-1.5 mid-phone:text-lg rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.25)]`}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!/\S+@\S+\.\S+/.test(formData.email) || formData.message.length === 0}
                                    onClick={() => {
                                        handleSubmit();
                                        setOpen(false);
                                    }}
                                    className={`font-fredoka cursor-pointer disabled:opacity-50 disabled:pointer-events-none font-semibold bg-primary hover:brightness-125 transition-all text-background w-full p-1 text-base mid-phone:p-1.5 mid-phone:text-lg rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.25)]`}
                                >
                                    Submit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmMessageModal;
