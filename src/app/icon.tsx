import { ImageResponse } from 'next/og';

export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#9333ea',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '20%', // Squircle looks larger than a circle in tabs
                }}
            >
                <svg width="32" height="32" viewBox="6 4 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Cat Face Silhouette - White and Filling the space */}
                    <path d="M16 25C20.4183 25 24 21.4183 24 17C24 14.5 22.5 12 20.5 11L21.5 6L17 8C16.6 8 16.3 8 16 8C15.7 8 15.4 8 15 8L10.5 6L11.5 11C9.5 12 8 14.5 8 17C8 21.4183 11.5817 25 16 25Z" fill="white" />

                    {/* Star on Forehead - Purple on White cat */}
                    <path d="M16 10L16.6 11.5H18.2L16.9 12.4L17.4 13.9L16 13L14.6 13.9L15.1 12.4L13.8 11.5H15.4L16 10Z" fill="#9333ea" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}
