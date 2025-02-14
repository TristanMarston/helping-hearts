import React, { useState } from 'react';
import { APIResponse } from './EditCollection';
import { Copy, Hash, Loader, RotateCcw, SquareArrowOutUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Fredoka } from 'next/font/google';
import axios from 'axios';
import toast from 'react-hot-toast';

const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaSemibold = Fredoka({ weight: '500', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

const ActionBar = ({ collection, response, setResponse }: { collection: string; response: APIResponse; setResponse: React.Dispatch<React.SetStateAction<APIResponse>> }) => {
    const [refreshed, setRefreshed] = useState<{ hovered: boolean; refreshing: boolean }>({ hovered: false, refreshing: false });
    const [exportDropdown, setExportDropdown] = useState(false);
    const [isTouchScreen, setIsTouchScreen] = useState(false);

    React.useEffect(() => {
        const handleTouchStart = () => setIsTouchScreen(true);
        const handleMouseMove = () => setIsTouchScreen(false);

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const refreshDocuments = async () => {
        function error() {
            toast.error('Refresh unsuccessful', { className: `${fredokaBold.className} !bg-background !text-black`, position: 'bottom-right', duration: 4000 });
            setRefreshed((prev) => {
                return {
                    ...prev,
                    refreshing: false,
                };
            });
        }

        setRefreshed((prev) => {
            return {
                ...prev,
                refreshing: true,
            };
        });

        axios
            .get(`/api/admin/get/${collection}`)
            .then((res) => {
                if (res.status === 200) {
                    setResponse({ data: res.data.data, schema: res.data.schema });
                    setRefreshed((prev) => {
                        return {
                            ...prev,
                            refreshing: false,
                        };
                    });
                } else error();
            })
            .catch((err) => {
                error();
            });
    };

    const copyToClipboard = (text: string) => {
        const toastID = toast.loading('Copying to clipboard...', { className: `${fredokaBold.className} !bg-background !text-black`, position: 'bottom-right' });

        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success('Copied to clipboard!', {
                    id: toastID,
                    duration: 4000,
                });
            })
            .catch((err) => {
                toast.error('Failed to copy.', {
                    id: toastID,
                    duration: 4000,
                });
            });
    };

    return (
        <section className={`${fredokaBold.className} w-full`}>
            <div className='w-full mid-phone:bg-background-secondary mid-phone:rounded-full mid-phone:shadow-[0_4px_30px_rgba(0,0,0,.4)] flex items-center justify-center mid-phone:justify-between mid-phone:py-3 mid-phone:px-4 gap-3 mid-phone:gap-0 flex-wrap'>
                <div className='flex items-center justify-start gap-3 w-full mid-phone:w-auto flex-wrap mid-phone:flex-nowrap'>
                    <div className='bg-background-very-light font-bold text-primary rounded-full shadow-[0_4px_30px_rgba(0,0,0,.25)] tracking-wider mid-phone:w-fit px-4 py-2 uppercase flex items-center justify-center gap-2 w-full'>
                        {/* <Hash className='w-5 h-5' strokeWidth={2.5} /> */}
                        {response.data.length} item{response.data.length === 1 ? '' : 's'}
                    </div>
                    <span
                        className='relative w-full mid-phone:w-auto'
                        onMouseEnter={() => !isTouchScreen && setExportDropdown(true)}
                        onMouseLeave={() => !isTouchScreen && setExportDropdown(false)}
                        onClick={() => isTouchScreen && setExportDropdown((prev) => !prev)}
                    >
                        <button className='bg-background-very-light font-bold text-primary rounded-full shadow-[0_4px_30px_rgba(0,0,0,.25)] tracking-wider mid-phone:w-fit px-4 py-2 uppercase flex items-center justify-center gap-2 w-full transition-all hover:brightness-110'>
                            <SquareArrowOutUpRight className='w-4 h-4 mid-phone:w-5 mid-phone:h-5' strokeWidth={2.5} />
                            EXPORT DATA
                        </button>
                        <AnimatePresence>
                            {exportDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`${fredokaBold.className} absolute w-full mid-phone:w-52 z-50 text-primary tracking-wider top-full mt-2 text-sm rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,.2)] text-center`}
                                >
                                    <div
                                        onClick={() => copyToClipboard(JSON.stringify(response.data))}
                                        className='flex items-center hover:brightness-110 bg-background-very-light transition-all gap-2 px-5 py-3 cursor-pointer rounded-2xl'
                                    >
                                        <Copy strokeWidth={2.5} />
                                        <span className='text-base'>Copy JSON</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </span>
                </div>
                <div className='flex items-center justify-center relative w-full mid-phone:w-auto'>
                    <div
                        onMouseEnter={() =>
                            setRefreshed((prev) => {
                                return {
                                    ...prev,
                                    hovered: true,
                                };
                            })
                        }
                        onMouseLeave={() =>
                            setRefreshed((prev) => {
                                return {
                                    ...prev,
                                    hovered: false,
                                };
                            })
                        }
                        className='mid-phone:p-2 cursor-pointer bg-background-very-light mid-phone:bg-transparent font-bold text-primary rounded-full shadow-[0_4px_30px_rgba(0,0,0,.25)] mid-phone:shadow-none tracking-wider w-full mid-phone:w-auto px-4 py-2 uppercase flex items-center justify-center gap-2 transition-all hover:brightness-110'
                        onClick={() => refreshDocuments()}
                    >
                        <span>
                            {!refreshed.refreshing ? (
                                <RotateCcw className='text-primary w-4 h-4 mid-phone:w-5 mid-phone:h-5' strokeWidth={2.5} />
                            ) : (
                                <Loader className='text-primary w-4 h-4 mid-phone:w-5 mid-phone:h-5 animate-spin' strokeWidth={2.5} />
                            )}
                        </span>
                        <span className='block mid-phone:hidden'>REFRESH</span>
                    </div>
                    <AnimatePresence>
                        {refreshed.hovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className={`${fredokaBold.className} absolute hidden mid-phone:block bg-background text-primary tracking-wider bottom-full mb-2 text-sm px-3 py-2 rounded-md shadow-[0_4px_30px_rgba(0,0,0,.2)] text-center`}
                            >
                                <span>Refresh</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default ActionBar;
