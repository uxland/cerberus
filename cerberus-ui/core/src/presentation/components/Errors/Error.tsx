export const Error = ({ error }: { error: string }) => {
    return (
        <div className="mt-2 text-red-500 text-sm bg-red-100 border border-red-400 rounded p-2">
            {error}
        </div>
    );
}