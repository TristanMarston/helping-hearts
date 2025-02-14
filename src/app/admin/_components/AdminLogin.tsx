'use client';

import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Fredoka, Sour_Gummy } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });

const AdminLogin = () => {
    const [formData, setFormData] = useState<{ username: string; password: string }>({ username: '', password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastID = toast.loading('Signing in...', {
            className: `${fredokaBold.className} !bg-background !text-black`,
            position: 'bottom-right',
        });

        axios
            .post(`/api/admin/login`, JSON.stringify({ username: formData.username, password: formData.password }))
            .then((res) => {
                if (res.status === 200) {
                    toast.success('Successfully signed in!', {
                        id: toastID,
                        duration: 4000,
                    });
                    router.push('/admin');
                }
            })
            .catch((err) => {
                toast.error('Invalid username or password', {
                    id: toastID,
                    duration: 4000,
                });
            });
    };

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
            setFormData((prev) => {
                return {
                    ...prev,
                    [key]: e.target.value,
                };
            });
        },
        [formData, setFormData]
    );

    return (
        <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1000px] flex flex-col mx-6 my-8'>
                <h1 className={`${sourGummyBold.className} text-black text-3xl wide:text-4xl mid-tablet:text-5xl mb-4`}>Administration Console</h1>
                <form
                    onSubmit={handleSubmit}
                    className='w-full rounded-2xl bg-background p-4 wide:p-6 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] h-full flex flex-col items-center gap-4'
                >
                    <span className='relative w-full'>
                        <input
                            type='text'
                            className={`${fredokaLight.className} px-4 pt-3 pb-2 wide:pb-3 wide:h-13 w-full h-11 text-lg bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                            autoComplete='off'
                            onChange={(e) => handleInputChange(e, 'username')}
                            value={formData.username}
                            placeholder=''
                        />
                        <label
                            className={`${fredokaLight.className} absolute pointer-events-none capitalize text-base wide:text-[17px] text-gray-500 duration-300 transform translate-x-[2px] translate-y-[-12.5px] scale-75 top-0 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-3.5 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto start-1`}
                        >
                            Username
                        </label>
                    </span>
                    <span className='relative w-full'>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            className={`${fredokaLight.className} px-4 pt-3 pb-2 wide:pb-3 wide:h-13 w-full h-11 text-lg bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                            autoComplete='off'
                            onChange={(e) => handleInputChange(e, 'password')}
                            value={formData.password}
                            placeholder=''
                        />
                        {passwordVisible ? (
                            <Eye onClick={() => setPasswordVisible((prev) => !prev)} className='text-primary w-6 h-6 absolute right-3 top-2.5 backdrop-blur-sm' />
                        ) : (
                            <EyeOff onClick={() => setPasswordVisible((prev) => !prev)} className='text-primary w-6 h-6 absolute right-3 top-2.5 backdrop-blur-sm rounded-full' />
                        )}
                        <label
                            className={`${fredokaLight.className} absolute pointer-events-none capitalize text-base wide:text-[17px] text-gray-500 duration-300 transform translate-x-[2px] translate-y-[-12.5px] scale-75 top-0 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-3.5 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto start-1`}
                        >
                            Password
                        </label>
                    </span>
                    <button
                        type='submit'
                        className={`${fredokaBold.className} bg-primary py-2 px-3 wide:py-2.5 wide:text-lg tracking-wider text-white w-full text-center rounded-xl shadow-lg cursor-pointer transition-all hover:brightness-110`}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
