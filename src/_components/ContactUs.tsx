'use client';

import { Jua } from 'next/font/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const jua = Jua({ weight: '400', subsets: ['latin'] });

const contactUsSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string(),
    subject: z.string().optional(),
    message: z.string(),
});

type FormMapArray = {
    name: 'firstName' | 'lastName' | 'email' | 'subject' | 'message';
    label: string;
    description?: string;
};

const ContactUs = () => {
    const form = useForm<z.infer<typeof contactUsSchema>>({
        resolver: zodResolver(contactUsSchema),
    });

    async function onSubmit(values: z.infer<typeof contactUsSchema>) {
        console.log(values);

        try {
            const response = await fetch('http://localhost:8000/messages', {
                body: JSON.stringify(values),
                method: 'POST',
            });
            console.log(response);
            console.log(JSON.stringify(values));

            if (!response.ok) {
                throw new Error('Failed to send data.');
            }

            console.log('Data sent successfully.');
        } catch (error) {
            console.error('Error sending data: ', error);
        }
    }

    const formMapArray: FormMapArray[] = [
        { name: 'firstName', label: 'first name' },
        { name: 'lastName', label: 'last name' },
        { name: 'email', label: 'email*' },
        { name: 'subject', label: 'subject' },
        { name: 'message', label: 'message*' },
    ];

    return (
        <div>
            <div className={`${jua.className} text-background text-3xl`}>contact us</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    {formMapArray.map((data, index) => (
                        <FormField
                            control={form.control}
                            name={data.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{data.label}</FormLabel>
                                    <FormControl>
                                        <input type='text' {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button type='submit'>Submit</Button>
                </form>
            </Form>
        </div>
    );
};

export default ContactUs;
