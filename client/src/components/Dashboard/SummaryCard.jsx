
const SummaryCard = ({icon,text,number,color}) => {
    return (
        <div  className="flex rounded bg-white">
            <div className={`flex items-center text-3xl ${color} justify-center px-4`}>{icon}</div>
            <div className="pl-4 py-1 font-bold ">
                <p>{text}</p>
                <p>{number}</p>
            </div>
        </div>
    );
};

export default SummaryCard;