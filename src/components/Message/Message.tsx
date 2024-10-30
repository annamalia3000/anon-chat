import classes from './message.module.css';

type MessageProps = {
    id: number;
    userId: string;
    content: string;
    isOwnMessage: boolean;
  };

export const Message =  ({ content, isOwnMessage }: MessageProps) => {
  return (
    <div 
    className={`${classes['message']} ${
        isOwnMessage ? classes['own-message'] : classes['other-message']
    }`}>
        {content}
    </div>
  )
}
