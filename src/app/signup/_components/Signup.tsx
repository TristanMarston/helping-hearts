import { Input } from '@/components/ui/input';
import { Jua, Nunito } from 'next/font/google';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

const Signup = () => {
    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[1280px] flex flex-col mx-6 my-10'>
                <h1 className={`${jua.className} text-4xl`}>Register Today!</h1>
                <div className='mt-5'>
                    <div className='relative'>
                        <Input
                            type='text'
                            id='floating_outlined'
                            className={`${nunitoLight.className} px-4 pt-3 pb-2 w-full h-11 text-base bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                            placeholder=''
                        />
                        <label
                            htmlFor='floating_outlined'
                            className={`${nunitoLight.className} absolute text-base text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto start-1`}
                        >
                            First Name
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
